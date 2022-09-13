export class GridDataResponseModel {
    public id: number = 0;
    public code: string = '';
    public name: string = '';
    public highPrice: number = 0;
    public lowPrice: number = 0;
    public priceDifference: number = 0;
    
    
    constructor (data: any, id: number) {
        if (data) {
            this.id = id;
            this.code = data.code;
            this.name = data.name;
            this.highPrice = Math.random() * 1000;
            this.lowPrice = (Math.random() * 1000 / 20);
            this.priceDifference = this.highPrice - this.lowPrice;
        }
    }
}