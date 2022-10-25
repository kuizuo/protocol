<script setup>
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div>
    <Suspense>
      <div flex flex-col justify-center items-center>
        <div min-w-sm>
          <Info />
          <Sign />
        </div>
        <CourseList />
      </div>
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>

