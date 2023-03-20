import type {ProductDto} from '@/dtos';
import {MethodEnum} from '@/enums';

export class ApiService {
  public async insertProduct(product: ProductDto): Promise<ProductDto> {
    return fetch('http://127.0.0.1:8080/product', {
      method: MethodEnum.Post,
      headers: {'Accept': 'application/json, text/plain, */*', 'Content-type': 'application/json'},
      body: JSON.stringify(product),
    }).then((result) => result.json());
  }

  public async getProducts(): Promise<ProductDto[]> {
    return fetch('http://127.0.0.1:8080/productList').then((result) => result.json());
  }

  public async getProduct(productId: number): Promise<ProductDto> {
    return fetch(`http://127.0.0.1:8080/product?productId=${productId}`).then((result) => result.json());
  }

  public async deleteProduct(productId: number): Promise<Response> {
    return fetch(`http://127.0.0.1:8080/product?productId=${productId}`, {
      method: MethodEnum.Delete,
    });
  }
}
