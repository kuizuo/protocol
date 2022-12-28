<script lang="ts" setup>
import type { Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuInst, MenuOption } from 'naive-ui'

const { collapsed } = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits(['update:collapsed'])

const route = useRoute()
const router = useRouter()

const selectedKey = ref('')
const menuInstRef = ref<MenuInst | null>(null)
const menus: MenuOption[] = router.options.routes
  .filter(route => route.meta?.layout === 'dashboard')
  .sort((a, b) => a.meta!.order - b.meta!.order)
  .map((page) => {
    const { meta, path, children } = page
    const { title, icon } = meta!

    return {
      label: title,
      key: path,
      icon: renderIcon(icon),
      ...(children!.length > 0 && {
        children: children!.filter(route => route.meta?.layout === 'dashboard').sort((a, b) => a.meta!.order - b.meta!.order).map((child) => {
          const { title, icon } = child.meta!

          return {
            label: title,
            key: `${path}/${child.path}`,
            icon: renderIcon(icon),
          }
        }),
      }),
    }
  })

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function clickMenuItem(key: string) {
  if (/http(s)?:/.test(key))
    window.open(key)

  else
    router.push({ path: key })
}

function selectAndExpand(key: string) {
  selectedKey.value = key
  menuInstRef.value?.showOption(key)
}

onMounted(() => {
  selectAndExpand(route.fullPath)
})
</script>

<template>
  <n-menu
    ref="menuInstRef"
    v-model:value="selectedKey"
    :collapsed-width="64"
    :collapsed-icon-size="20"
    :collapsed="collapsed"
    :options="menus"
    @update:value="clickMenuItem"
  />
</template>

<style scoped>

</style>
