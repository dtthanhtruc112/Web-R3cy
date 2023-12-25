export class AccountCustomer {
    user: any;
    // constructor(
    //   public _id: any ,
    //   public Name: string = '',
    //   public phonenumber: string = '',
    //   public Mail: string = '',
    //   public password: string = '',
    //   public role: string = '',
    //   public userid: number | null = null,
    // ) {}
    constructor(
      public _id: any = null,
      public Name: string = '',
      public phonenumber: string = '',
      public Mail: string = '',
      public password: string = '',
      public role: string = '',
      public userid: number = 0,  // hoặc bất kỳ giá trị mặc định nào phù hợp

    ) {}
  }
  