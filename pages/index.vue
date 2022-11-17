<template>
  <div>
    <!-- <Logo mb-6 /> -->
    <Suspense>
      <Demo />
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
    </Suspense>
  </div>
</template>
