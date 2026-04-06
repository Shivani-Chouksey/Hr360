import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class LocalStorageService {

  set(key: string, value: any, expiresIn:string): void {
    const ttlSeconds = convertExpiryToSeconds(expiresIn);
    const expiresAt = Date.now() + ttlSeconds * 1000;
    localStorage.setItem(
      key,
      JSON.stringify({ value, expiresAt })
    );
  }

  get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;

    const parsed = JSON.parse(data);

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
function convertExpiryToSeconds(expiry: string): number {
  const value = parseInt(expiry);

  if (expiry.includes('d')) return value * 24 * 60 * 60; // days
  if (expiry.includes('h')) return value * 60 * 60;      // hours
  if (expiry.includes('m')) return value * 60;           // minutes

  return value; // fallback
}