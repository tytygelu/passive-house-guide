// Enhanced logger implementation
export const log = {
  info: (message: string, ...args: unknown[]) => console.log(`[INFO] ${message}`, ...args),
  warn: (message: string, ...args: unknown[]) => console.warn(`[WARN] ${message}`, ...args),
  error: (message: string, error: unknown, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, {
      error,
      stack: error instanceof Error ? error.stack : undefined,
      ...args
    });
  },
};
