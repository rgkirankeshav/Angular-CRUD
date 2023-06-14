import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { productResponse } from './productResponse';
import { DeletProductResponse } from './DeleteProductResponse';
import { NgForm } from '@angular/forms';


interface updateFormData {
brand: string;
category:string;
id:number
title:string 
price: number
}

@Injectable({
  providedIn: 'root'
})
export class TableService {

  actionSuccess = new EventEmitter<string>();
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http:HttpClient) { }

  //GET ALL PRODUCTS
  getAllProducts(){
    return this.http.get<productResponse>('https://dummyjson.com/products');
  }

  //Delete Product
  deleteProduct(productId:number){
   return this.http.delete<DeletProductResponse>(`https://dummyjson.com/products/${productId}`);
  }

  //Update Product
  updateProduct(productData: { [key: string]: any },productId:number){
    let body = JSON.stringify(productData)
    return this.http.put<productResponse>(`https://dummyjson.com/products/${productId}`,body,{headers:this.headers});
  }

  // Create product
  createProduct(productData:NgForm){
    let body = JSON.stringify(productData);
    return this.http.post<productResponse>('https://dummyjson.com/products/add',body,{headers:this.headers})
  }


}
