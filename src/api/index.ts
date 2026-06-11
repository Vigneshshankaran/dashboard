/**
 * index.ts — the front door of the API folder.
 *
 * Pages import from '../api' (this file) instead of reaching into
 * individual files, e.g.:  import { AuthService, SeniorService } from '../api'
 */
export * from './types';
export * from './client';
export * from './services';
export { client as default } from './client';
