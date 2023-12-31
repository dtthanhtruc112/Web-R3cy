// export class Diachi {
//     constructor(
//         public tendiachi: string = '',
//     ) { }
// }


// export class Users {
//     constructor(
//         public _id: any = null,
//         public userid: number,
//         public hovaten: string = '',
//         public sdt: string = '',
//         public email: string = '',
//         public gioitinh: string = '',
//         public ngaysinh: string = '',
//         public hinhdaidien: string = '',
//         public matkhau: string = '',
//         public diachi: Diachi[],
//     ) { }
// }


export class Address {
    constructor(
        public country: string = '',
        public postcodeZip: string = '',
        public province: string = '',
        public district: string = '',
        public addressDetail: string = '',
    ) { }
  }
  
  export class Customer{
    constructor(
      public _id: any = null,
      public Name: string='',
      public phonenumber: string='',
      public Mail: string='',
      public password: string='',
      public role: string='',
      public userid: number = 0,
      public gender: string='',
      public dob: string='',
      public avatar: string='',
      public addresses: Address[],
    ){}
  }
    