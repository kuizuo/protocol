import { setup } from '@css-render/vue3-ssr'
import type { NuxtSSRContext } from '#app'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    const { collect } = setup(nuxtApp.vueApp)
    const originalRenderMeta = nuxtApp.ssrContext?.renderMeta

    nuxtApp.ssrContext ||= {} as NuxtSSRContext
    nuxtApp.ssrContext!.renderMeta = () => {
      if (!originalRenderMeta) {
        return {
          headTags: collect(),
        }
      }
      const originalMeta = originalRenderMeta()
      if ('then' in originalMeta) {
        return originalMeta.then((resolvedOriginalMeta) => {
          return {
            ...resolvedOriginalMeta,
            headTags: resolvedOriginalMeta.headTags + collect(),
          }
        })
      }
      else {
        return {
          ...originalMeta,
          headTags: originalMeta.headTags + collect(),
        }
      }
    }
  }
})
