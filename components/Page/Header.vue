<script lang="ts" setup>
const route = useRoute()

const generator: any = (routerMap: any) => {
  return routerMap.map((item: any) => {
    const currentMenu = {
      ...item,
      label: item.meta.title,
      key: item.name,
      disabled: item.path === '/',
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentMenu.children = generator(item.children, currentMenu)
    }
    return currentMenu
  })
}

const breadcrumbList = computed(() => {
  return generator(route.matched)
})
</script>

<template>
  <div class="mb-6">
    <n-page-header>
      <template #header>
        <n-breadcrumb>
          <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
            <n-breadcrumb-item v-if="routeItem.meta.title">
              <n-icon :component="routeItem.meta.icon" />
              <span ml-2>
                {{ routeItem.meta.title }}
              </span>
            </n-breadcrumb-item>
          </template>
        </n-breadcrumb>
      </template>
      <slot />
    </n-page-header>
  </div>
</template>
