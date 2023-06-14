export interface productResponse {
    products: productResponse[];
    title:string;
    id:number;
    discountPercentage: number;
    brand:string;
    category:string;
    description:string;
    price: number;
    rating:number;
    stock:number
    thumbnail:string;
}