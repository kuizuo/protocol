<script setup lang="ts">
const userStore = useUserStore()
const courseList = $computed(() => userStore.courseList)

const router = useRouter()

function goActivity(course: API.Course) {
  router.push({ path: `/course/activity/${course.courseId}` })
}
</script>

<template>
  <n-divider dashed>
    课程列表
  </n-divider>
  <n-card v-if="courseList?.length > 0">
    <n-grid :x-gap="12" :y-gap="8" cols="2 s:3 m:4 l:4 xl:4 2xl:6" responsive="screen">
      <n-grid-item v-for="course in courseList" :key="course.courseId">
        <n-card :title="course.name" size="small" hoverable h-full hover="cursor-pointer" @click="goActivity(course)">
          <template #cover>
            <img :src="course.img">
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-card>
  <div v-else>
    <n-empty description="暂无课程" size="small">
      <template #extra>
        <n-button size="small" @click="userStore.getCourseList()">
          获取课程
        </n-button>
      </template>
    </n-empty>
  </div>
</template>
