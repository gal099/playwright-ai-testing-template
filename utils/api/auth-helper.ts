import { request } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

/**
 * Authentication helper for API-based login operations
 */
export class AuthHelper {
  private baseURL: string;

  constructor() {
    if (!process.env.APP_URL) {
      throw new Error(
        'APP_URL must be set in .env file. ' +
        'Please configure your application URL before running tests.'
      );
    }

    this.baseURL = process.env.APP_URL;
  }

  /**
   * Login as Organization Admin and retrieve authentication token
   */
  async loginAsOrgAdmin(): Promise<AuthToken> {
    const context = await request.newContext();

    const response = await context.post(`${this.baseURL}/api/auth/login`, {
      data: {
        email: process.env.ORG_ADMIN_USER,
        password: process.env.PORTAL_PASS,
      },
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }

    const data = await response.json();
    await context.dispose();

    return {
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    };
  }

  /**
   * Login as Super Admin and retrieve authentication token
   */
  async loginAsSuperAdmin(): Promise<AuthToken> {
    const context = await request.newContext();

    const response = await context.post(`${this.baseURL}/api/auth/login`, {
      data: {
        email: process.env.SUPER_ADMIN_USER,
        password: process.env.SUPER_ADMIN_PASS,
      },
    });

    if (!response.ok()) {
      throw new Error(`Super Admin login failed: ${response.status()} ${await response.text()}`);
    }

    const data = await response.json();
    await context.dispose();

    return {
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    };
  }

  /**
   * Generic login
   */
  async login(email: string, password: string): Promise<AuthToken> {
    const context = await request.newContext();

    const response = await context.post(`${this.baseURL}/api/auth/login`, {
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
    }

    const data = await response.json();
    await context.dispose();

    return {
      accessToken: data.accessToken || data.access_token || data.token,
      refreshToken: data.refreshToken || data.refresh_token,
    };
  }
}

export const authHelper = new AuthHelper();
