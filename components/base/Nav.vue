<script setup lang="ts">
import pkg from '~/package.json'
const appConfig = useAppConfig()
</script>

<template>
  <nav px-8 py-4 border="b gray-400/10" flex="~ gap-2 " items-center>
    <RouterLink to="/" flex="~ gap-2" items-center>
      <img src="/logo.png" h-10>
      <div font-sans ml-2 mr-6 leading-1em text-left text-sm capitalize>
        {{ appConfig.title }}
      </div>
    </RouterLink>

    <div flex="auto" />

    <div flex="~ gap-4" items-center>
      <RouterLink to="/changelog">
        <div font-medium text-sm hover="opacity-100 text-teal-600">
          更新公告
        </div>
      </RouterLink>
      <RouterLink to="/help">
        <div font-medium text-sm hover="opacity-100 text-teal-600">
          帮助说明
        </div>
      </RouterLink>

      <DarkToggle />
      <a i-ri-github-line :href="pkg.repository.url" target="_blank" />
    </div>
  </nav>
</template>
