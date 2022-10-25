<script setup lang="ts">
const { activityList } = defineProps<{
  activityList: API.Activity[]
}>()

const SignMap = {

}

const userStore = useUserStore()
</script>

<template>
  <div v-if="activityList.length > 0">
    <n-list hoverable clickable>
      <n-list-item v-for="activity in activityList" :key="activity.id">
        <n-thing>
          <template v-if="activity.logo" #avatar>
            <n-avatar :size="50" :src="activity.logo" style="--n-color: rgb(255 255 255 / 0%);" />
          </template>
          <template #header>
            <div inline-flex items-center font-sans>
              <h2 text-lg>
                {{ activity.nameOne }}
              </h2>
              <p ml-1 text-sm text-gray>
                {{ activity.nameFour }}
              </p>
            </div>
          </template>
        </n-thing>
        <template #suffix>
          <n-button v-if="activity.status === 1" type="primary" @click="userStore.signByCourse()">
            点我签到
          </n-button>
        </template>
      </n-list-item>
    </n-list>
  </div>
  <div v-else>
    <n-empty description="暂无活动" size="small" />
  </div>
</template>

<style scoped>
:deep(.n-thing-header-wrapper) {
  --at-apply: "flex items-center"
}
</style>
