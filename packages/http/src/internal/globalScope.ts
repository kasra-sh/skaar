const globalScopeObj: any = { SHTTP_DEBUG: true };

export const globalScope: any =
   typeof globalThis === 'object'
      ? globalThis
      : typeof global === 'object'
      ? global
      : typeof window === 'object'
      ? window
      : globalScopeObj;
