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

  it.skip('getCourseList', async () => {
    await cx.getCourseList()

    console.log(cx.courseList.length)
  })

  it.skip('getActivity', async () => {
    const course = cx.courseList.find(c => c.name === '愧怍课程')!
    activityList = await cx.getActivity(course)
    console.log(activityList.length)
  })

  it.skip('signGeneral', async () => {
    const result = await cx.signGeneral(activityList[0])
    console.log(result)
  })

  it.skip('getAllSignActivity', async () => {
    await cx.getAllActivity()
  })

  it.skip('getSignActivityList', async () => {
    const signActivity = await cx.getSignActivityList()
    console.log(signActivity.length)
  })

  it('sign', async () => {
    await cx.sign()
  })
})
