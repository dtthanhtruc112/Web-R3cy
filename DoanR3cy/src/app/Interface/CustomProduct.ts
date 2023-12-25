export class CustomProduct {
  constructor(
    public Name: string = '',
    public phonenumber: string = '',
    public Mail: string = '',
    public pname: string = '',
    public pdes: string = '',
    public pfile?: File  // Thêm trường pfile kiểu File
  ) {}
}
