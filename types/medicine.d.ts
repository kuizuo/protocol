declare namespace API {
  export interface Medicine {
      id: number
      name: string
      img: string
      tags: string
      medDesc: string
      price: number
      stockNum: number
      manufactureDate: string
      purchaseDate: string
      shelfLife: number
      batchNumber: string
      isOtc: string
      type: {
        id: number
        name: string
      }
  }
}  