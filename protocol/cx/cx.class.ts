import { qsParse, qsStringify, timestamp } from '@kuizuo/utils'
import cheerio from 'cheerio'
import { AHttp } from '@kuizuo/http'
import { mapLimit } from 'async'

export enum ActivityStatusEnum {
  Doing = 1,
  Done = 2,
}

export enum ActivityTypeEnum {
  Sign = 2, // 签到
  Answer = 4, // 抢答
  Talk = 5, // 主题谈论
  Question = 6, // 投票
  Homework = 19,
}

export enum SignTypeEnum {
  General = '0', // 普通签到/拍照签到
  QrCode = '2', // 二维码签到
  Gesture = '3', // 手势签到
  Location = '4', // 位置签到
  Code = '5', // 签到码签到
}

export class Cx {
  public http: AHttp
  public user: CX.User
  public courseList: CX.Course.Item[] = []

  constructor(user: CX.User) {
    this.http = new AHttp({ withCookie: true, unauthorized: true, timeout: 10 * 1000 })
    this.user = user
  }

  async login(): Promise<string> {
    if (/^1[3-9]\d{9}$/.test(this.user.username)) {
      const query = qsStringify({
        name: this.user.username,
        pwd: encodeURIComponent(this.user.password),
        schoolid: '',
        verify: '',
      })

      const url_login = `https://passport2.chaoxing.com/api/login?${query}`

      const { data } = await this.http.get<CX.LoginResult>(url_login)

      if (!data.result)
        return data.errorMsg

      await this.parseUserInfo(data)
      this.user.logged = true
      return '登录成功'
    }
    else {
      if (!this.user.school)
        return '请输入学校'

      return '代码还在编写中...'
    }
  }

  async logout() {
    this.user = {} as CX.User
    this.courseList = []
    this.http.cookieJar.removeAllCookiesSync()
  }

  async parseUserInfo(data: CX.LoginResult) {
    this.user.realname = data.realname

    this.user.userid = this.http.getCookie('_uid') as string
    this.user.fid = this.http.getCookie('fid') as string || '0'

    const { data: html } = await this.http.get(`http://i.chaoxing.com/base?t=${timestamp()}`)

    const $ = cheerio.load(html)
    this.user.avatar = `${$('.head-img').attr('src') + this.user.userid}_80`
    this.user.siteName = $('#siteName').attr('title')
  }

  async getCourseList() {
    const { data: html } = await this.http.post<string, string>(
      'http://mooc1-1.chaoxing.com/visit/courselistdata',
      qsStringify({ courseType: '1', courseFolderId: '0', courseFolderSize: '0' }),
    )
    const $ = cheerio.load(html)

    const courseList: CX.Course.Item[] = $('.course').map((i, el) => {
      const img = $(el).find('img').attr('src')!

      const finish = false

      const href = $(el).find('.course-info').find('a').attr('href')!
      const name = $(el).find('.course-name').attr('title')!

      const param = qsParse(href.substring(href.indexOf('?') + 1))! as {
        courseid: string
        clazzid: string
        cpi: string
        enc: string
      }

      const course: CX.Course.Item = {
        name,
        finish,
        courseId: param.courseid,
        classId: param.clazzid,
        enc: param.enc,
        cpi: param.cpi,
        img,
        link: href,
      }

      return course
    }).get()

    this.courseList = courseList
    return courseList
  }

  async getActivity(course: CX.Course.Item) {
    const query = qsStringify({
      fid: this.user.fid,
      courseId: course.courseId,
      classId: course.classId,
      _: timestamp(),
    })

    const { data } = await this.http.get<CX.Activity.Data>(`https://mobilelearn.chaoxing.com/v2/apis/active/student/activelist?${query}`)
    return data.data.activeList.map(a => ({ course, ...a })) ?? []
  }

  async preSign(course: CX.Course.Item, activity: CX.Activity.Item) {
    const query = qsStringify({
      courseId: course.courseId,
      classId: course.classId,
      activePrimaryId: activity.id,
      general: '1',
      sys: '1',
      ls: '1',
      appType: '15',
      tid: '',
      uid: this.user.userid,
      ut: 's',
    })
    await this.http.get(`https://mobilelearn.chaoxing.com/newsign/preSign?${query}`)
  }

  async pptSign(query: string) {
    const { data } = await this.http.get(`https://mobilelearn.chaoxing.com/pptSign/stuSignajax?${query}`)

    if (data === 'success')
      return '签到成功'
    else
      return data
  }

  async signGeneral(activity: CX.Activity.Item) {
    const query = qsStringify({
      activeId: activity.id,
      uid: this.user.userid,
      clientip: '',
      latitude: '-1',
      longitude: '-1',
      appType: '15',
      fid: this.user.fid,
      name: this.user.realname,
    }, '', '', { encodeURIComponent: s => s })

    return this.pptSign(query)
  }

  async signLocation(activity: CX.Activity.Item,
    location: CX.Activity.Location = {
      latitude: '-1',
      longitude: '-1',
    }) {
    // 位置 https://api.map.baidu.com/lbsapi/getpoint/index.html
    const query = qsStringify({
      activeId: activity.id,
      address: '',
      uid: this.user.userid,
      clientip: '',
      latitude: location.latitude,
      longitude: location.longitude,
      appType: '15',
      fid: this.user.fid,
      name: this.user.realname,
      ifTiJiao: 1,
    }, '', '', { encodeURIComponent: s => s })

    return this.pptSign(query)
  }

  async signQrCode(activity: CX.Activity.Item, enc: string) {
    const query = qsStringify({
      enc,
      activeId: activity.id,
      uid: this.user.userid,
      clientip: '',
      useragent: '',
      latitude: '-1',
      longitude: '-1',
      fid: this.user.fid,
      appType: '15',
      name: this.user.realname,
    }, '', '', { encodeURIComponent: s => s })

    return this.pptSign(query)
  }

  async getAllActivity(type?: number, status?: number) {
    const courseList = await this.getCourseList()

    const activityArr = await mapLimit(courseList, 5, async (course: CX.Course.Item) => await this.getActivity(course))

    return activityArr.flat(1)
      .filter(activity => (type ? activity.type === type : true) && (status ? activity.status === status : true))
  }

  async getSignActivityList() {
    return this.getAllActivity(ActivityTypeEnum.Sign, ActivityStatusEnum.Doing)
  }

  async signByCourse(course: CX.Course.Item) {
    const activityList = await this.getActivity(course)

    const signActivityList = activityList.filter(activity => activity.type === ActivityTypeEnum.Sign && activity.status === ActivityStatusEnum.Doing)

    const signResult = []

    for await (const activity of signActivityList) {
      await this.preSign(course, activity)
      if (activity.type === ActivityTypeEnum.Sign) {
        await this.preSign(activity.course, activity)
        // console.log('预签成功')

        let result = ''
        if ([SignTypeEnum.General, SignTypeEnum.Gesture, SignTypeEnum.Code].includes(activity.otherId as SignTypeEnum)) {
          result = await this.signGeneral(activity)
        }
        else if (activity.otherId === SignTypeEnum.QrCode) {
          // await this.signQrCode(activity, activity.enc)
        }
        else if (activity.otherId === SignTypeEnum.Location) {
          result = await this.signLocation(activity)
        }

        signResult.push({
          activity,
          result,
        })
      }
    }

    return signResult
  }

  async sign() {
    const signActivityList = await this.getSignActivityList()

    const signResult = []
    for await (const activity of signActivityList) {
      if (activity.type === ActivityTypeEnum.Sign) {
        await this.preSign(activity.course, activity)
        // console.log('预签成功')

        let result = ''
        if ([SignTypeEnum.General, SignTypeEnum.Gesture, SignTypeEnum.Code].includes(activity.otherId as SignTypeEnum)) {
          result = await this.signGeneral(activity)
        }
        else if (activity.otherId === SignTypeEnum.QrCode) {
          // await this.signQrCode(activity, activity.enc)
        }
        else if (activity.otherId === SignTypeEnum.Location) {
          result = await this.signLocation(activity)
        }

        signResult.push({
          activity,
          result,
        })
      }
    }
    return signResult
  }
}
