<script setup lang="ts">
const userStore = useUserStore()
const info = $computed(() => userStore.info)
</script>

<template>
  <div>
    <n-avatar :size="100" :src="info?.avatar" />
    <div flex justify-center items-center gap-4>
      <p>{{ info?.school }}</p>
      {{ info?.username }}
    </div>
    <n-button @click="userStore.logout()">
      登出
    </n-button>
  </div>
</template>

<style scoped>
</style>
