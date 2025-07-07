import { camelCase, snakeCase } from "change-case";

/**
 * Converts all keys in a DB row to camelCase
 */
export function dbToApp<T extends object>(row: Record<string, any>): T {
    const result: any = {};
    for (const key in row) {
        result[camelCase(key)] = row[key];
    }
    return result as T;
}

/**
 * Converts a JS object to snake_case keys for DB INSERT/UPDATE
 */
export function appToDb(obj: Record<string, any>): Record<string, any> {
    const result: any = {};
    for (const key in obj) {
        result[snakeCase(key)] = obj[key];
    }
    return result;
}
