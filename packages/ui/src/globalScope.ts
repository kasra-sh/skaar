const globalScopeObj: any = { SUI_DEBUG: true };

export const globalScope: any = typeof globalThis === 'object' ? globalThis : typeof global === 'object' ? global : typeof window === 'object' ? window : globalScopeObj;
