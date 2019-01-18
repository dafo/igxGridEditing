import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IProduct } from './product';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {

    private _url = 'http://localhost:36830/api/products/';
    // private _url = 'http://localhost:57162/odata/Products/';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<HttpResponse<IProduct[]>> {
        return this.http.get<IProduct[]>(this._url, {observe: 'response' });
    }

    commitProducts(transactions): Observable<HttpResponse<IProduct[]>> {
        const request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:36830/api/batch');
        request.setRequestHeader('Content-Type', `multipart/mixed; boundary="----WebKitFormBoundary7MA4YWxkTrZu0gW"`);

        // tslint:disable-next-line:no-debugger
        debugger;
        // tslint:disable-next-line:max-line-length
        request.send('------WebKitFormBoundary7MA4YWxkTrZu0gW Content-Type: application/http; msgtype=request POST /api/Products HTTP/1.1 Host: localhost:36830 Content-Type: application/json; charset=utf-8' +
        transactions.getTransactionLog()[0].newValue +
        '------WebKitFormBoundary7MA4YWxkTrZu0gW--');
        return ;
    }
}
