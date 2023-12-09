export interface Order {
    ordernumber: number,
    products: Product[];
    status: string;
    userid: number
}

export interface Product{
    id: number,
    category1: string,
    category2: string,
    name: string,
    price: number,
    quantity: number,
    productValue: number
}