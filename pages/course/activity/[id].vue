<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const courseId = route.params.id as string

const userStore = useUserStore()

let course = null

useAsyncData(async () => {
  course = userStore.courseList.find((item: API.Course) => item.courseId === courseId)!
  await userStore.getActivityList(course)
})

let activityList = $ref<API.Activity[]>([])

const fetchActivityList = async () => {
  const res = await userStore.getActivityList(course)
  activityList = res
}

fetchActivityList()

function handleBack() {
  router.back()
}
</script>

<template>
  <n-page-header :subtitle="course.name" @back="handleBack">
    <ActivityList :activity-list="activityList" />
  </n-page-header>
</template>

<style scoped>

</style>
