declare namespace API {
  interface User {
    username: string
    avatar: string
    note: string
  }

  interface Login {
    username: string
    password: string
    captcha: string
  }
}
