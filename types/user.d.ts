declare namespace API {
  interface Login extends Pick<CX.User, 'username' | 'password'> {}

  interface User extends CX.User {}

  interface Course extends CX.Course.Item {}
}
