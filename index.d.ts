declare module '@nuxt/schema' {
  interface AppConfig {
    title: string;
    description?: string
  }

  interface RuntimeConfig {
    cookieName: string;
    cookieSecret: string;
    cookieExpires: number
    cookieRememberMeExpires: number
    jwtSecret: string
  }
}

export { }
