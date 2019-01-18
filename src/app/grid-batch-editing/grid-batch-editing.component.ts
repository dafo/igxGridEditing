import { Component, OnInit, ViewChild } from '@angular/core';

import { IgxDialogComponent, IgxGridComponent, Transaction } from 'igniteui-angular';
import { ProductService } from './product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grid-batch-editing',
  styleUrls: ['./grid-batch-editing.component.scss'],
  templateUrl: './grid-batch-editing.component.html'
})
export class GridBatchEditingComponent implements OnInit {
  @ViewChild('gridRowEditTransaction', { read: IgxGridComponent }) public grid: IgxGridComponent;
  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;
  @ViewChild('dialogGrid', { read: IgxGridComponent }) public dialogGrid: IgxGridComponent;

  public data = [];
  public transactionsData: Transaction[] = [];
  private addProductId: number;

  public get transactions() {
    return this.grid.transactions;
  }

  constructor(private _productService: ProductService) {
  }

  public ngOnInit(): void {
    this._productService.getProducts().subscribe(resp => {
      const keys = resp.headers.keys();
      this.data = resp.body;

    });
    this.addProductId = this.data.length + 1;
    this.transactionsData = this.transactions.getAggregatedChanges(true);
    this.transactions.onStateUpdate.subscribe(() => {
        this.transactionsData = this.transactions.getAggregatedChanges(true);
    });
  }

  public addRow() {
    this.grid.addRow({
      CategoryID: this.getRandomInt(1, 10),
      Discontinued: this.getRandomInt(1, 10) % 2 === 0,
      OrderDate: new Date(this.getRandomInt(2000, 2050), this.getRandomInt(0, 11), this.getRandomInt(1, 25))
      .toISOString().slice(0, 10),
      ProductID: this.addProductId++,
      ProductName: 'Product with index ' + this.getRandomInt(0, 20),
      QuantityPerUnit: (this.getRandomInt(1, 10) * 10).toString() + ' pcs.',
      ReorderLevel: this.getRandomInt(10, 20),
      SupplierID: this.getRandomInt(1, 20),
      UnitPrice: this.getRandomInt(10, 1000),
      UnitsInStock: this.getRandomInt(1, 100),
      UnitsOnOrder: this.getRandomInt(1, 20)
    });
  }

  public deleteRow(event, rowID) {
    this.grid.deleteRow(rowID);
  }

  public openCommitDialog() {
    this.dialog.open();
    this.dialogGrid.reflow();
  }

  public commit() {
    // tslint:disable-next-line:no-debugger
    // debugger;
    this._productService.commitProducts(this.grid.transactions).subscribe(resp => {
    });
    this.grid.transactions.commit(this.data);
    this.dialog.close();
  }

  public cancel() {
    this.dialog.close();
  }

  public discard() {
    this.grid.transactions.clear();
    this.dialog.close();
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private classFromType(type: string): string {
    return `transaction--${type.toLowerCase()}`;
  }

  public get hasTransactions(): boolean {
    return this.grid.transactions.getAggregatedChanges(false).length > 0;
  }

  public stateFormatter(value: string) {
    return JSON.stringify(value);
  }

  public typeFormatter(value: string) {
    return value.toUpperCase();
  }
}
