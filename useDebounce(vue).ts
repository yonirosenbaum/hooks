import { onUnmounted, ref, Ref, watch } from "vue"

export const useDebounce = <T, F extends (...args: any[]) => any>(callback: F, trigger: Ref<T>, delay: number = 300) => {
  let timeout: ReturnType<typeof setTimeout>

  const cancel = () => {
    clearTimeout(timeout)
  }

  watch(trigger, () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback()
    }, delay)
  })

  // Cleanup on unmount
  onUnmounted(() => {
    clearTimeout(timeout)
  })

  return { cancel }
}
