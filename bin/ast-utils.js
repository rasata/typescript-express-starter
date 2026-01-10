/**
 * AST manipulation utilities for Swagger injection
 */

import { Project, QuoteKind } from 'ts-morph';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { ProjectGenerationError, withErrorHandling } from './errors.js';

/**
 * Main Swagger injection function with proper error handling
 */
export async function injectSwaggerIntoApp(destDir) {
  const appPath = path.join(destDir, 'src', 'app.ts');

  if (!(await fs.pathExists(appPath))) {
    console.log(chalk.yellow(`[inject-swagger] skip: ${appPath} not found`));
    return;
  }

  return withErrorHandling(async () => {
    const project = createProject();
    const source = project.addSourceFileAtPath(appPath);

    await addSwaggerImports(source);
    await updateEnvImports(source);
    await addSwaggerMethod(source);
    await updateConstructor(source);

    source.formatText({ indentSize: 2, convertTabsToSpaces: true });
    await source.save();
    console.log(chalk.green('[inject-swagger] Successfully updated app.ts'));
  }, 'Swagger injection failed')();
}

/**
 * Create TypeScript project instance
 */
function createProject() {
  return new Project({
    manipulationSettings: { quoteKind: QuoteKind.Single },
    skipAddingFilesFromTsConfig: true,
  });
}

/**
 * Add Swagger-related imports
 */
async function addSwaggerImports(source) {
  const importDecls = source.getImportDeclarations();
  const findImport = (mod) => importDecls.find((d) => d.getModuleSpecifierValue() === mod);
  const morganImport = findImport('morgan');

  // Remove existing swagger imports for repositioning
  const swaggerJSDocImport = findImport('swagger-jsdoc');
  const swaggerUiImport = findImport('swagger-ui-express');
  if (swaggerJSDocImport) swaggerJSDocImport.remove();
  if (swaggerUiImport) swaggerUiImport.remove();

  // Calculate insertion index after morgan
  const afterMorganIndex = morganImport
    ? importDecls.indexOf(morganImport) + 1
    : importDecls.length;

  // Insert swagger imports
  source.insertImportDeclaration(afterMorganIndex, {
    defaultImport: 'swaggerJSDoc',
    moduleSpecifier: 'swagger-jsdoc',
  });

  source.insertImportDeclaration(afterMorganIndex + 1, {
    defaultImport: 'swaggerUi',
    moduleSpecifier: 'swagger-ui-express',
  });
}

/**
 * Update environment imports to include API_SERVER_URL
 */
async function updateEnvImports(source) {
  const envImport = source
    .getImportDeclarations()
    .find((d) => d.getModuleSpecifierValue() === '@config/env');

  if (!envImport) {
    console.log(chalk.yellow('[inject-swagger] Warning: @config/env import not found'));
    return;
  }

  // Skip if namespace import
  if (envImport.getNamespaceImport()) return;

  // Check if API_SERVER_URL is already imported
  const hasNamed = envImport.getNamedImports().some((n) => n.getName() === 'API_SERVER_URL');

  if (!hasNamed) {
    envImport.addNamedImport('API_SERVER_URL');
  }
}

/**
 * Add initializeSwagger method to App class
 */
async function addSwaggerMethod(source) {
  const appClass = source.getClass('App') || source.getClasses()[0];

  if (!appClass) {
    throw new ProjectGenerationError('No App class found in app.ts', 'swagger-injection');
  }

  // Check if method already exists
  let initMethod = appClass.getInstanceMethod('initializeSwagger');
  if (initMethod) {
    console.log(chalk.yellow('[inject-swagger] initializeSwagger method already exists, skipping'));
    return;
  }

  const errorMethod = appClass.getInstanceMethod('initializeErrorHandling');
  const insertIndex = errorMethod ? errorMethod.getChildIndex() : undefined;

  const methodStructure = {
    name: 'initializeSwagger',
    scope: 'private',
    parameters: [{ name: 'apiPrefix', type: 'string' }],
    statements: generateSwaggerMethodBody(),
  };

  if (insertIndex !== undefined) {
    appClass.insertMethod(insertIndex, methodStructure);
  } else {
    appClass.addMethod(methodStructure);
  }
}

/**
 * Generate the body of the initializeSwagger method
 */
function generateSwaggerMethodBody() {
  return (writer) => {
    writer.writeLine('const options = {');
    writer.indent(() => {
      writer.writeLine('swaggerDefinition: {');
      writer.indent(() => {
        writer.writeLine(`openapi: '3.0.0',`);
        writer.writeLine('info: {');
        writer.indent(() => {
          writer.writeLine(`title: 'REST API',`);
          writer.writeLine(`version: '1.0.0',`);
          writer.writeLine(`description: 'Example API Documentation',`);
        });
        writer.writeLine('},');
        writer.writeLine('servers: [');
        writer.indent(() => {
          writer.writeLine('{');
          writer.indent(() => {
            writer.writeLine(
              `url: API_SERVER_URL || \`http://localhost:\${this.port}\${apiPrefix}\`,`,
            );
            writer.writeLine(
              `description: this.env === 'production' ? 'Production server' : 'Local server',`,
            );
          });
          writer.writeLine('},');
        });
        writer.writeLine('],');
        writer.writeLine('components: {');
        writer.indent(() => {
          writer.writeLine('securitySchemes: {');
          writer.indent(() => {
            writer.writeLine('bearerAuth: {');
            writer.indent(() => {
              writer.writeLine(`type: 'http',`);
              writer.writeLine(`scheme: 'bearer',`);
              writer.writeLine(`bearerFormat: 'JWT',`);
            });
            writer.writeLine('},');
          });
          writer.writeLine('},');
        });
        writer.writeLine('},');
      });
      writer.writeLine('},');
      writer.writeLine("apis: ['swagger.yaml', 'src/controllers/*.ts'],");
    });
    writer.writeLine('};');
    writer.blankLine();
    writer.writeLine('const specs = swaggerJSDoc(options);');
    writer.writeLine(`this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));`);
  };
}

/**
 * Update constructor to call initializeSwagger
 */
async function updateConstructor(source) {
  const appClass = source.getClass('App') || source.getClasses()[0];
  if (!appClass) return;

  const constructor = appClass.getConstructors()[0];
  if (!constructor) {
    console.log(chalk.yellow('[inject-swagger] Warning: No constructor found'));
    return;
  }

  const bodyText = constructor.getBodyText();
  if (bodyText.includes('this.initializeSwagger')) {
    console.log(chalk.yellow('[inject-swagger] Constructor already calls initializeSwagger'));
    return;
  }

  // Find initializeErrorHandling call and insert before it
  const statements = constructor.getBody().getStatements();
  const errorHandlingIndex = statements.findIndex((stmt) =>
    stmt.getText().includes('this.initializeErrorHandling'),
  );

  if (errorHandlingIndex !== -1) {
    constructor.insertStatements(errorHandlingIndex, 'this.initializeSwagger(apiPrefix);');
    console.log(chalk.green('[inject-swagger] Added initializeSwagger call to constructor'));
  } else {
    // Fallback: append to end of constructor
    constructor.addStatements('this.initializeSwagger(apiPrefix);');
    console.log(chalk.green('[inject-swagger] Added initializeSwagger call at end of constructor'));
  }
}
