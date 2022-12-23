<script lang="ts" setup>
import DashBoardIcon from '~icons/carbon/dashboard'

const route = useRoute()

const title = route.meta.title as string

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard',
  title: '仪表盘',
  icon: DashBoardIcon,
  order: 1,
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="title" class="capitalize" />
    </PageHeader>
    <PageBody>
      <PageSection>
        <p />
      </PageSection>
      <PageSection>
        <n-grid x-gap="12" :cols="4">
          <n-gi v-for="i in 4" :key="i">
            <n-card title="卡片">
              卡片内容
            </n-card>
          </n-gi>
        </n-grid>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
