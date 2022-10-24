import { describe, expect, it } from 'vitest'
import { Cx } from './cx.class'

const testAccount: CX.User = {
  username: '',
  password: '',
}

describe('cx', async () => {
  const cx = new Cx(testAccount)
  let activityList: CX.Activity.Item[] = []

  it('login', async () => {
    const result = await cx.login()

    console.log(result)
    console.log(cx.user)

    expect(result).toBe('登录成功')
    console.log('realname', cx.user.realname)
    console.log('userid', cx.user.userid)
    console.log('avatar', cx.user.avatar)
  })

  it('getCourseList', async () => {
    await cx.getCourseList()

    console.log(cx.courseList.length)
  })

  it('getActivity', async () => {
    activityList = await cx.getActivity(cx.courseList.find(c => c.name === '愧怍课程'))
    console.log(activityList)
  })

  it('sign', async () => {
    const result = await cx.sign(activityList[0])
    console.log(result)
  })
})
