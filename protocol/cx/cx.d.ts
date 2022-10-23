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
  };


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
    result: boolean
    opacPwd: boolean
    errorMsg: string
    status: string
  }

  namespace Course {

    interface Item {
      name: string 
      finish: boolean 
      courseId: string  
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


}
