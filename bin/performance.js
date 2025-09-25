/**
 * Performance optimization utilities
 */

import { execa } from 'execa';
import { NetworkError, withRetry } from './errors.js';
import { CONFIG } from './config.js';

/**
 * Version cache for package lookups
 */
class VersionCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  /**
   * Get latest version with caching
   */
  async getLatestVersion(packageName) {
    // Return cached result if available
    if (this.cache.has(packageName)) {
      return this.cache.get(packageName);
    }

    // Return pending promise if request is in progress
    if (this.pendingRequests.has(packageName)) {
      return this.pendingRequests.get(packageName);
    }

    // Create new request
    const promise = this._fetchLatestVersion(packageName);
    this.pendingRequests.set(packageName, promise);

    try {
      const version = await promise;
      this.cache.set(packageName, version);
      return version;
    } finally {
      this.pendingRequests.delete(packageName);
    }
  }

  /**
   * Fetch latest version from npm registry
   */
  async _fetchLatestVersion(packageName) {
    return withRetry(
      async () => {
        try {
          const { stdout } = await execa('npm', ['view', packageName, 'version'], {
            timeout: CONFIG.timeout.versionCheck,
          });
          return stdout.trim();
        } catch (error) {
          throw new NetworkError(
            `Failed to fetch version for ${packageName}`,
            'version-check',
            'Check your internet connection and try again',
          );
        }
      },
      3,
      1000,
    );
  }

  /**
   * Prefetch versions for multiple packages in parallel
   */
  async prefetchVersions(packageNames) {
    const promises = packageNames.map((name) => this.getLatestVersion(name));
    const results = await Promise.allSettled(promises);

    const successful = [];
    const failed = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push({
          package: packageNames[index],
          version: result.value,
        });
      } else {
        failed.push({
          package: packageNames[index],
          error: result.reason,
        });
      }
    });

    return { successful, failed };
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cachedPackages: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Global version cache instance
 */
export const versionCache = new VersionCache();

/**
 * Batch package operations
 */
export class PackageBatch {
  constructor() {
    this.packages = [];
  }

  /**
   * Add package to batch
   */
  add(packageSpec) {
    this.packages.push(packageSpec);
    return this;
  }

  /**
   * Add multiple packages to batch
   */
  addMany(packageSpecs) {
    this.packages.push(...packageSpecs);
    return this;
  }

  /**
   * Resolve all packages with versions
   */
  async resolve() {
    const resolved = await Promise.all(
      this.packages.map(async (spec) => {
        if (this._isExplicitSpecifier(spec)) {
          return spec;
        }

        const { name, version } = this._splitNameAndVersion(spec);

        if (version && version.length > 0) {
          return `${name}@${version}`;
        }

        try {
          const latest = await versionCache.getLatestVersion(name);
          return latest ? `${name}@${latest}` : name;
        } catch (error) {
          console.warn(`Warning: Could not resolve version for ${name}, using latest`);
          return name;
        }
      }),
    );

    return resolved;
  }

  /**
   * Check if package specifier is explicit
   */
  _isExplicitSpecifier(spec) {
    return (
      spec.startsWith('http://') ||
      spec.startsWith('https://') ||
      spec.startsWith('git+') ||
      spec.startsWith('file:') ||
      spec.startsWith('link:') ||
      spec.startsWith('workspace:') ||
      spec.startsWith('npm:')
    );
  }

  /**
   * Split package name and version
   */
  _splitNameAndVersion(spec) {
    if (spec.startsWith('@')) {
      const idx = spec.indexOf('@', 1);
      if (idx === -1) return { name: spec, version: null };
      return { name: spec.slice(0, idx), version: spec.slice(idx + 1) };
    } else {
      const idx = spec.indexOf('@');
      if (idx === -1) return { name: spec, version: null };
      return { name: spec.slice(0, idx), version: spec.slice(idx + 1) };
    }
  }
}
