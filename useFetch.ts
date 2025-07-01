import { ref, readonly, onUnmounted, unref, watchEffect, type UnwrapRef } from 'vue'

type MaybeRef<T> = T | (() => T)

/**
 * Basic fetch composable
 * @param url        – string | () => string (reactive or static)
 * @param init       – RequestInit options (optional)
 * @param immediate  – run immediately? (default true)
 */
export function useFetch<T = unknown>(
  url: MaybeRef<string>,
  init: RequestInit = {},
  immediate = true,
) {
  const data     = ref<T | null>(null)
  const error    = ref<unknown | null>(null)
  const loading  = ref(false)

  let controller: AbortController | null = null

  async function execute(override: RequestInit = {}) {
    // Cancel any in‑flight request
    controller?.abort()
    controller = new AbortController()

    loading.value = true
    error.value   = null

    try {
      const response = await fetch(unref(url) as string, {
        ...init,
        ...override,
        signal: controller.signal,
      })

      if (!response.ok)
        throw new Error(`${response.status} ${response.statusText}`)

      // Type‑parameter T lets callers cast/parse as they wish
      data.value = (await response.json()) as UnwrapRef<T>
      return data.value
    } catch (err) {
      // Don't swallow AbortErrors—surface them so callers can ignore if desired
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  /** Manually abort the current request */
  function abort() {
    controller?.abort()
  }

  // Auto‑run when `url` is reactive & `immediate` = true
  if (immediate) {
    watchEffect(() => {
      // Lazy‑guard against first run if url is empty
      if (unref(url)) execute().catch(() => {})
    })
  }

  // Cleanup on component unmount
  onUnmounted(abort)

  return {
    data   : readonly(data),
    error  : readonly(error),
    loading: readonly(loading),
    execute,
    abort,
  }
}
