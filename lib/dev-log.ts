/** Logs only in development — keeps production logs clean. */
export function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

export function devError(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args)
  }
}

export function devWarn(...args: unknown[]) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args)
  }
}
