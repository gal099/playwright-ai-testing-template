import { request } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

/**
 * Helper para autenticación via API
 */
export class AuthHelper {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.PORTAL_URL || 'https://sima-360-portal.vercel.app';
  }

  /**
   * Login como Organization Admin y obtener token
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
   * Login como Super Admin y obtener token
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
