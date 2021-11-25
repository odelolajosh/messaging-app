export function addAlpha(color: string, opacity: number): string {
    // coerce values so ti is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

export const throttle = (fn: (...args: any[]) => void, delay: number = 10) => {
    let lastCalled = 0;
    return (...args: any[]) => {
      let now = new Date().getTime();
      if(now - lastCalled < delay) {
        return;
      }
      lastCalled = now;
      return fn(...args);
    }
  }