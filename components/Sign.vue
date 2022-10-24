<script setup lang="ts">
const userStore = useUserStore()
</script>

<template>
  <n-space>
    <n-button type="info" @click="userStore.autoSign()">
      自动签到
    </n-button>
  </n-space>
</template>

<style scoped>

</style>
