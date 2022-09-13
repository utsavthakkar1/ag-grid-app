import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GridDataService {
    constructor(private http: HttpClient){}

    public getGridData(): Observable<any[]> {
        return this.http.get<any[]>('https://www.ag-grid.com/example-assets/stocks.json');
    }
}