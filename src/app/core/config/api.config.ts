import { environment } from '@env/environment';

/**
 * Centralized API configuration. Swap baseUrl with your AWS API Gateway
 * endpoint when migrating off the public fakestore API.
 */
export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    products: '/products',
  },
  timeoutMs: 12_000,
} as const;
