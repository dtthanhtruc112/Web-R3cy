export class Diachi {
    constructor(
        public tendiachi: string = '',
    ) { }
}


export class Users {
    constructor(
        public _id: any = null,
        public userid: number,
        public hovaten: string = '',
        public sdt: string = '',
        public email: string = '',
        public gioitinh: string = '',
        public ngaysinh: string = '',
        public hinhdaidien: string = '',
        public matkhau: string = '',
        public diachi: Diachi[],
    ) { }
}