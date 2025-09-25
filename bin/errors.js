/**
 * Custom error classes for better error handling
 */

import chalk from 'chalk';

/**
 * Base CLI error class
 */
export class CLIError extends Error {
  constructor(message, phase = null, suggestion = null, code = 1) {
    super(message);
    this.name = 'CLIError';
    this.phase = phase;
    this.suggestion = suggestion;
    this.code = code;
  }
}

/**
 * Project generation specific error
 */
export class ProjectGenerationError extends CLIError {
  constructor(message, phase, suggestion = null) {
    super(message, phase, suggestion, 1);
    this.name = 'ProjectGenerationError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends CLIError {
  constructor(message, field, suggestion = null) {
    super(message, 'validation', suggestion, 2);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Network error
 */
export class NetworkError extends CLIError {
  constructor(message, operation, suggestion = null) {
    super(message, 'network', suggestion, 3);
    this.name = 'NetworkError';
    this.operation = operation;
  }
}

/**
 * File system error
 */
export class FileSystemError extends CLIError {
  constructor(message, path, suggestion = null) {
    super(message, 'filesystem', suggestion, 4);
    this.name = 'FileSystemError';
    this.path = path;
  }
}

/**
 * Enhanced error printing function
 */
export function printError(error, context = null) {
  if (error instanceof CLIError) {
    console.log(chalk.bgRed.white(` ${error.name.toUpperCase()} `), chalk.red(error.message));

    if (error.phase) {
      console.log(chalk.gray('Phase:'), chalk.cyan(error.phase));
    }

    if (error.suggestion) {
      console.log(chalk.gray('Hint:'), chalk.cyan(error.suggestion));
    }

    if (context) {
      console.log(chalk.gray('Context:'), chalk.yellow(context));
    }
  } else {
    // Fallback for non-CLI errors
    console.log(chalk.bgRed.white(' ERROR '), chalk.red(error.message || error));
    if (context) {
      console.log(chalk.gray('Context:'), chalk.yellow(context));
    }
  }
}

/**
 * Error handler wrapper for async functions
 */
export function withErrorHandling(fn, errorMessage = 'Operation failed') {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof CLIError) {
        throw error;
      }
      throw new CLIError(errorMessage, null, error.message);
    }
  };
}

/**
 * Retry mechanism with exponential backoff
 */
export async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(chalk.yellow(`Attempt ${attempt} failed, retrying in ${delay}ms...`));
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
