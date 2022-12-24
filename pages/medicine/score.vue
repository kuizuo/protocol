<script lang="ts" setup>
import ShoppingIcon from '~icons/carbon/shopping-cart'

const route = useRoute()

const title = route.meta.title as string

definePageMeta({
  layout: 'dashboard',
  title: '药品积分兑换',
  icon: ShoppingIcon,
  order: 6,
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="title" class="capitalize" />
    </PageHeader>
    <PageBody>
      <PageSection>
        TODO...
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
