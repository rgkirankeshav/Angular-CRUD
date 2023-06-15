import { Component, ElementRef } from '@angular/core';
import { TableService } from '../table.service';
import { productResponse } from '../productResponse';
import * as bootstrap from 'bootstrap';
import { DeletProductResponse } from '../DeleteProductResponse';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  columnData: string[] = [
    'Product',
    'Brand',
    'Category',
    'Price',
    'Discount',
    'Actions',
  ];

  productsData: productResponse[] = [];
  selectedProductName: string = '';
  selectedProductBrand: string = '';
  selectedProductCategory: string = '';
  selectedProductPrice: number = 0;
  selectedProductDiscount: number = 0;
  selectedProductId: number = 0;
  actionMessage: string = '';
  updateFormData: {
    id: number;
    title: string;
    category: string;
    brand: string;
    price: number;
  } = { id: 0, title: '', category: '', brand: '', price: 0 };
  addFormData: {
    title: string;
    category: string;
    brand: string;
    price: number;
    discountPercentage:number
  } = { title: '', category: '', brand: '', price: 0, discountPercentage:0};

  constructor(
    private tableService: TableService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.initializeModal();
    this.tableService.getAllProducts().subscribe((product) => {
      this.productsData = product.products;
      console.log(this.productsData, 'PRODUCTS');
    });
  }

  //VIEW PRODUCT OPENS BOOTSTRAP MODAL
  viewProduct(productId:number) {
    const modalElement = this.elementRef.nativeElement.querySelector('#viewProductModal');
    const modal = new bootstrap.Modal(modalElement);
    this.tableService.viewProduct(productId).subscribe((product:productResponse) => {
      this.selectedProductName = product.title;
      this.selectedProductBrand = product.brand;
      this.selectedProductCategory = product.category;
      this.selectedProductPrice = product.price;
      this.selectedProductId = product.id;
      this.selectedProductDiscount = product.discountPercentage;
    })


    modal.show();
  }

  //DELETE PRODUCT
  deleteProduct(product: productResponse) {
    this.selectedProductId = product.id;
    this.tableService
      .deleteProduct(this.selectedProductId)
      .subscribe((deletedProduct: DeletProductResponse) => {
        this.productsData = this.productsData.filter((product) => {
          return product.id != deletedProduct.id;
        });
        this.actionMessage = `${product.title} #${deletedProduct.id} deleted`;
        this.tableService.actionSuccess.emit(this.actionMessage);
      });
  }

  //UPDATE PRODUCT
  updateProduct(product: NgForm) {
    const modifiedControls: { [key: string]: any } = {};
    Object.keys(product.form.controls).forEach((key) => {
      const control = product.form.controls[key];
      if (control.dirty) {
        modifiedControls[key] = control.value;
      }
    });
    let productId = product.form.controls['id'].value;
    this.tableService
      .updateProduct(modifiedControls, productId)
      .subscribe((updatedProduct: productResponse) => {
        const index = this.productsData.findIndex(
          (product) => updatedProduct.id === product.id
        );
        this.productsData[index] = updatedProduct;
        this.actionMessage = `${updatedProduct.title} #${updatedProduct.id} updated`;
        this.tableService.actionSuccess.emit(this.actionMessage);
      });
    const modalElement = document.getElementById('updateProductModal');
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }

  //VIEW UPDATE BOOTSTRAP MODAL
  viewUpdateModal(product: productResponse) {
    const modalElement = this.elementRef.nativeElement.querySelector(
      '#updateProductModal'
    );
    const modal = new bootstrap.Modal(modalElement);
    this.updateFormData.title = product.title;
    this.updateFormData.brand = product.brand;
    this.updateFormData.category = product.category;
    this.updateFormData.price = product.price;
    this.updateFormData.id = product.id;
    modal.show();
  }

  //Add Product
  addProduct(formData: NgForm) {
    console.log(formData,'FOrmData');
    this.tableService.createProduct(formData.form.value).subscribe((createdProduct:productResponse) => {
       this.productsData.push(createdProduct);
       this.actionMessage = `${createdProduct.title} #${createdProduct.id} created`;
       this.tableService.actionSuccess.emit(this.actionMessage);
    })
    const modalElement = document.getElementById('addProductModal');
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }

  // Open AddForm Modal
  openAddModal() {
    const modalElement =
      this.elementRef.nativeElement.querySelector('#addProductModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  private initializeModal() {
    const modalElement =
      this.elementRef.nativeElement.querySelector('#viewProductModal');
    new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
    const updateModal = this.elementRef.nativeElement.querySelector(
      '#updateProductModal'
    );
    new bootstrap.Modal(updateModal, { backdrop: 'static', keyboard: false });
    const addModal =
      this.elementRef.nativeElement.querySelector('#addProductModal');
    new bootstrap.Modal(addModal, { backdrop: 'static', keyboard: false });
  }

  closeModal() {
    const modalElement = document.getElementById('myModal');
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) bootstrapModal.hide();
    }
  }
}
