/**
 * Makes sure function is called only once within the timeframe.
 * Always unsubscribe from this function
 * @param fn function to be executed
 * @returns unsubscribe function
 */
export const once = (fn: Function, unsubscribe?: Function, timeout?: number) => {
  const id = setTimeout(() => {
    fn()
  }, timeout ?? 1000);

  return () => {
    if (unsubscribe)
      unsubscribe()
    clearTimeout(id)
  }
}