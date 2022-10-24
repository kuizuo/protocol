export const useAuth = () => {
  // FIXME: replace __session to custom key
  const logged = useCookie('__session')

  return {
    logged,
  }
}
