export interface ITableData {
    id: number; // Unique ID for event
    siteName: string;
    extLowTemperature: number;
    extHighTemperature: number;
    precipitation: number;
    peakGustTime: number;
    peakGustDirection: string;
    airTemperature: number;
}



/**
 * Event type to make request for more details
 */
type SelectedPointMarker = {
    stationId: string;
}



export class TableData implements ITableData {
    id: number; // Unique ID for event
    siteName: string;
    extLowTemperature: number;
    extHighTemperature: number;
    precipitation: number;
    peakGustTime: number;
    peakGustDirection: strinng;
    airTemperature: number;

    constructor(id: number, siteName: string, extLowTemperature: number, extHighTemperature: number, precipitation: number, peakGustTime: number, peakGustDirection: string, airTemperature: number) {
        this.id = id;
        this.siteName = siteName;
        this.extLowTemperature = extLowTemperature;
        this.extHighTemperature = extHighTemperature;
        this.precipitation = precipitation;
        this.peakGustTime = peakGustTime;
        this.peakGustDirection = peakGustDirection;
        this.airTemperature = airTemperature;
    }
}

export class TableDataCollection {
    data: TableData[];

    constructor() {
        this.data = [];
    }

    setData(data: TableData[]) {
        this.data = data;
    }

    addData(data: TableData) {
        this.data.push(data);
    }


}
