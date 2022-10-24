<script setup lang="ts">
const userStore = useUserStore()
const info = $computed(() => userStore.info)
</script>

<template>
  <div flex justify-center items-center>
    <n-avatar :src="info?.avatar" />
    <div flex justify-center items-center gap-2 ml-2>
      <span>{{ info?.siteName }}</span>
      <span>{{ info?.realname }}</span>
      <!-- <span>{{ info?.username }}</span> -->
      <n-button size="small" @click="userStore.logout()">
        退出
      </n-button>
    </div>
  </div>
</template>

<style scoped>
</style>
