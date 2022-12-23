import { USER_TOKEN } from '~~/utils/constant'

export const useAuth = () => {
  const logged = useCookie(USER_TOKEN)

  return {
    logged,
  }
}
