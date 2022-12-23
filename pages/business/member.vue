<script lang="ts" setup>
import UserIcon from '~icons/carbon/user'

const route = useRoute()

const title = route.meta.title as string

definePageMeta({
  layout: 'dashboard',
  title: '会员列表',
  icon: UserIcon,
  order: 5,
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="title" class="capitalize" />
    </PageHeader>
    <PageBody>
      <PageSection>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia autem
          debitis ab dolorum tempore placeat possimus perferendis porro sit aut
          nobis quasi hic consequuntur, atque impedit nihil totam illo odit?
        </p>
      </PageSection>
      <PageSection>
        <div v-for="i in 30" :key="i" class="text-6xl uppercase">
          测试
        </div>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
