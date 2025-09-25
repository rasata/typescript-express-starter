/**
 * Validation utilities for user inputs and security
 */

import path from 'path';
import { CONFIG } from './config.js';
import { ValidationError } from './errors.js';

/**
 * Validate project name
 */
export function validateProjectName(name) {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Project name is required', 'projectName');
  }

  if (name.length > CONFIG.maxProjectNameLength) {
    throw new ValidationError(
      `Project name must be less than ${CONFIG.maxProjectNameLength} characters`,
      'projectName',
      'Use a shorter, descriptive name',
    );
  }

  if (!CONFIG.validation.projectName.test(name)) {
    throw new ValidationError(
      'Project name can only contain letters, numbers, hyphens, and underscores',
      'projectName',
      'Use alphanumeric characters with hyphens or underscores',
    );
  }

  // Check for reserved names
  const reservedNames = ['node_modules', 'package.json', 'src', 'dist', 'build'];
  if (reservedNames.includes(name.toLowerCase())) {
    throw new ValidationError(
      `"${name}" is a reserved name and cannot be used`,
      'projectName',
      'Choose a different project name',
    );
  }

  return name;
}

/**
 * Validate and resolve project path
 */
export function validateProjectPath(projectPath) {
  if (!projectPath || typeof projectPath !== 'string') {
    throw new ValidationError('Project path is required', 'projectPath');
  }

  const resolved = path.resolve(projectPath);
  const cwd = process.cwd();

  // Prevent path traversal attacks
  if (!resolved.startsWith(cwd)) {
    throw new ValidationError(
      'Project path must be within current directory',
      'projectPath',
      'Use a relative path or absolute path within current directory',
    );
  }

  // Check for dangerous paths (시스템 루트 디렉토리만 제한)
  const dangerousPaths = ['/etc', '/usr', '/var', '/tmp'];
  if (dangerousPaths.some((dangerous) => resolved.startsWith(dangerous))) {
    throw new ValidationError(
      'Cannot create project in system directories',
      'projectPath',
      'Choose a safe location within your workspace',
    );
  }

  return resolved;
}

/**
 * Check if package specifier is explicit (URL, file, etc.)
 */
export function isExplicitSpecifier(spec) {
  const explicitPrefixes = ['http://', 'https://', 'git+', 'file:', 'link:', 'workspace:', 'npm:'];

  return explicitPrefixes.some((prefix) => spec.startsWith(prefix));
}

/**
 * Split package name and version from specifier
 */
export function splitNameAndVersion(spec) {
  if (isExplicitSpecifier(spec)) {
    return { name: spec, version: null };
  }

  if (spec.startsWith('@')) {
    // Scoped package: @scope/package@version
    const idx = spec.indexOf('@', 1);
    if (idx === -1) {
      return { name: spec, version: null };
    }
    return {
      name: spec.slice(0, idx),
      version: spec.slice(idx + 1),
    };
  } else {
    // Regular package: package@version
    const idx = spec.indexOf('@');
    if (idx === -1) {
      return { name: spec, version: null };
    }
    return {
      name: spec.slice(0, idx),
      version: spec.slice(idx + 1),
    };
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }

  // Remove potentially dangerous characters
  return input.replace(/[<>:"|?*]/g, '').trim();
}

/**
 * Validate Node.js version
 */
export function validateNodeVersion(required = CONFIG.minNodeVersion) {
  const current = parseInt(process.versions.node.split('.')[0], 10);

  if (current < required) {
    throw new ValidationError(
      `Node.js ${required}+ required. You have ${process.versions.node}`,
      'nodeVersion',
      `Please upgrade your Node.js to version ${required} or higher`,
    );
  }

  return current;
}
