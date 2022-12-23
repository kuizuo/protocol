<script lang="ts" setup>
import BoxIcon from '~icons/carbon/box'

definePageMeta({
  layout: 'dashboard',
  redirect: '/medicine/stock',
  title: '药品管理',
  icon: BoxIcon,
  order: 2,
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
