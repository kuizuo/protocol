declare namespace CX {
  interface User {
    username: string
    password: string
    logged?: boolean
    school?: string
    realname?: string
    userid?: string
    fid?: string
    avatar?: string
    siteName?: string
  }


  interface LoginResult {
    // sucess
    result: boolean
    uid: number
    uname: string
    phone: string
    roleid: string
    schoolid: number
    opacPwd: boolean
    cxid: number
    email: string
    isCertify: number
    realname: string
    status: string

    // error
    errorMsg: string
  }

  namespace Course {

    interface Item {
      name: string
      finish: boolean
      courseId: string
      classId: string
      enc: string
      cpi: string
      img: string
      link: string
    }

    interface Data {
      code: string
      courseList: Item[]
    }

    interface Body {
      courseType: string
      courseFolderId: string
      courseFolderSize: string
    }
  }

  namespace Activity {

    interface Item {
      activityList: any
      userStatus: number
      nameTwo: string
      otherId: string
      groupId: number
      source: number
      isLook: number
      type: number
      releaseNum: number
      attendNum: number
      activeType: number
      logo: string
      nameOne: string
      startTime: number
      id: number
      endTime: number
      status: number
      nameFour: string

      course?: Course.Item
    }

    interface Data {
      result: number
      msg: any
      data: {
        ext: {
          _from_: string
        }
        readingDuration: number
        activeList: Item[]
      }
      errorMsg: any
    }

    interface Location {
      latitude: string
      longitude: string
    } 
  }
}
