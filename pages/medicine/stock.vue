<script lang="ts" setup>
import ListIcon from '~icons/carbon/list'

const route = useRoute()

const title = route.meta.title as string

definePageMeta({
  layout: 'dashboard',
  title: '药品库存列表',
  icon: ListIcon,
  order: 4,
})
</script>

<template>
  <PageWrapper>
    <PageHeader />
    <PageBody>
      <PageSection />
    </PageBody>
  </PageWrapper>
</template>
