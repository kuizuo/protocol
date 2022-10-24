import { describe, expect, it } from 'vitest'
import { Cx } from './cx.class'

const testAccount: CX.User = {
  username: '15280326573',
  password: 'zw12wz',
}

describe('cx', async () => {
  const cx = new Cx(testAccount)

  it('login', async () => {
    const result = await cx.login()

    console.log(result)
    console.log(cx.user)

    expect(result).toBe('登录成功')
    expect(cx.user.realname).toBe('无')
    expect(cx.user.userid).toBe('140422442')
    expect(cx.user.avatar).toBe('http://photo.chaoxing.com/p/140422442_80')
  })

  it('getCourseList', async () => {
    await cx.getCourseList()

    console.log(cx.courseList)
  })
})
