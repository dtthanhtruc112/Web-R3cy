export class AccountCustomer {
  user: any;
  constructor(
    public _id: any = null,
    public nickname: string | null = null,
    public Name: string = '',
    public phonenumber: string = '',
    public Mail: string = '',
    public password: string = '',
    public role: string = '',
    public userid: number = 0,  // hoặc bất kỳ giá trị mặc định nào phù hợp
    public gender: string | null = null,
    public dob: string | null = null,
    public avatar: string | null = null,
    public addresses: Address[] = [],
  ) {}
}
export interface Address {
  country: string;
  postcodeZip: string;
  province: string;
  district: string;
  addressDetail: string;
  isDefault: boolean;
  editMode?: boolean;
}