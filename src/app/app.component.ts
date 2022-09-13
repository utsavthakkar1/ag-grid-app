import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, CellClickedEvent, GetRowIdFunc, ValueFormatterParams, GetRowIdParams, ValueGetterParams, GridApi } from 'ag-grid-community';
import { Observable, Subscription, switchMap, take, timer } from 'rxjs';
import { GridDataResponseModel } from './grid-data-response.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ag-grid-app';
  public columnDefs: ColDef[] = [
    { field: 'id', maxWidth: 90 },
    { field: 'code', maxWidth: 100 },
    { field: 'name', minWidth: 300 },
    {
      field: 'highPrice',
      cellClass: 'cell-number',
      editable: true,
      valueFormatter: numberFormatter,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      maxWidth: 200
    },
    {
      field: 'lowPrice',
      cellClass: 'cell-number',
      editable: true,
      valueFormatter: numberFormatter,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      maxWidth: 200
    },
    {
      field: 'priceDifference',
      cellClass: 'cell-number',
      valueFormatter: numberFormatter,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      editable: false,
      maxWidth: 200,
      valueGetter: valueGetter,
      cellStyle: params => {
        if (params.value < 0) {
          return { color: 'white', backgroundColor: 'red' }
        } else {
          return { color: 'white', backgroundColor: 'green' }
        }
      }
    },
  ];
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true
  };

  public getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
    return params.data.code;
  };
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;

  public subscription !: Subscription;
  constructor(private http: HttpClient) { }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.subscription = timer(0, 600).pipe(
      take(200),
      switchMap(() => this.http.get<any[]>('https://www.ag-grid.com/example-assets/stocks.json')))
      .subscribe(data => {
        data = data.map((values, i) => new GridDataResponseModel(values, i + 1)).slice(0, 300);
        params.api.setRowData((data as Array<any>))
      });
  }

  // public onRemoveSelected() {
  //   const rowsToRemove = this.gridApi.getSelectedRows();
  //   const tx = {
  //     remove: rowsToRemove,
  //   };
  //   this.gridApi.applyServerSideTransaction(tx);
  // }

}
function numberFormatter(params: ValueFormatterParams) {
  if (typeof params.value === 'number') {
    return params.value.toFixed(2);
  }
  return params.value;
}

function valueGetter(params: ValueGetterParams): number {
  return params.data.highPrice - params.data.lowPrice;
}
