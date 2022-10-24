import querystring from 'querystring'
import { qsParse, qsStringify, timestamp } from '@kuizuo/utils'
import cheerio from 'cheerio'
import { AHttp } from '@kuizuo/http'
export class Cx {
  public http: AHttp
  public user: CX.User
  public courseList: CX.Course.Item[] = []

  constructor(user: CX.User) {
    this.http = new AHttp({ withCookie: true, timeout: 10 * 1000 })
    this.user = user
  }

  async login(): Promise<string> {
    if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(this.user.username)) {
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

    return data.data.activeList ?? []
  }

  async sign(activity: CX.Activity.Item) {
    // 位置 https://api.map.baidu.com/lbsapi/getpoint/index.html
    const query = querystring.stringify ({
      activeId: activity.id,
      uid: this.user.userid,
      clientip: '',
      latitude: '-1',
      longitude: '-1',
      appType: '15',
      fid: this.user.fid,
      name: activity.nameOne,
    }, '', '', { encodeURIComponent: str => str })
    const { data } = (await this.http.get(`https://mobilelearn.chaoxing.com/pptSign/stuSignajax?${query}`))

    if (data === 'success')
      return '签到成功'
    else
      return data
  }

  async signQrCode() {

  }

  async signAll() {

  }
}
