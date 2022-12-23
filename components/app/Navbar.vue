<script lang="ts" setup>
const app = useAppConfig()

const router = useRouter()
const userStore = useUserStore()
const navbar = ref(null)

const avatarOptions = [
  {
    label: '退出登录',
    key: 2,
  },
]

// 头像下拉菜单
const avatarSelect = (key: number) => {
  switch (key) {
    case 2:
      userStore.logout()
      break
  }
}
</script>

<template>
  <div
    ref="navbar"
    class="backdrop-filter backdrop-blur-md top-0 z-40 w-full flex-none transition-colors duration-300 lg:z-50 border-b border-gray-900/10 dark:border-gray-50/[0.2] bg-white/[0.5] dark:bg-slate-900/[0.5]"
  >
    <div id="navbar-banner" class="banner">
      <slot name="banner" />
    </div>
    <div class="max-w-8xl w-full mx-auto">
      <div class="py-3 lg:px-8 mx-4 lg:mx-0">
        <div class="relative flex items-center">
          <!-- title -->
          <slot name="title">
            <NuxtLink
              tag="a"
              class="mr-3 flex-none overflow-hidden md:w-auto text-md font-bold text-gray-900 dark:text-gray-200"
              :to="{ name: 'index' }"
            >
              <span class="sr-only">home</span>
              <span class="flex items-center">
                <i
                  i-ri:medicine-bottle-line
                  class="inline-block mr-2 text-lg text-primary-500"
                />
                {{ app.title }}
              </span>
            </NuxtLink>
          </slot>
          <div flex-1 />
          <!-- 个人中心 -->
          <div class="">
            <NDropdown trigger="hover" :options="avatarOptions" @select="avatarSelect">
              <div class="cursor-pointer">
                <NAvatar round src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg">
                  {{ userStore.info?.username }}
                  <template #icon>
                    <UserOutlined />
                  </template>
                </NAvatar>
              </div>
            </NDropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.slide-fade-from-up-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-from-up-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-from-up-enter-from,
.slide-fade-from-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

a.router-link-active {
  font-weight: bold;
}
a.router-link-exact-active {
  color: theme('colors.slate.900');
}
html.dark {
  a.router-link-exact-active {
    color: theme('colors.white');
  }
}
</style>
