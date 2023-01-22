import { globalScope } from './globalScope';

export function warnDuplicateHeader(key: string) {
   if (!globalScope.SHTTP_DEBUG) return;
   console.warn(`[WARN] Setting duplicate headers "${key}" causes last value to override.`);
}
