export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth()

  if (!auth.logged.value)
    return navigateTo({ name: 'login' })
})
