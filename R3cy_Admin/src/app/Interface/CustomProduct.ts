export class CustomProduct {
  constructor(
    public _id:any = null,
    public Name: string = '',
    public phonenumber: string = '',
    public Mail: string = '',
    public pname: string = '',
    public pdes: string = '',
    public pfile?: File  // Thêm trường pfile kiểu File
  ) {}
}
