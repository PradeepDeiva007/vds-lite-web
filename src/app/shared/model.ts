export interface SummaryChart {
    id?: number;
    loadNo?: string;
    city?: string;
    quantity?: string;
    vlsp?: string;
    plannedLocation?: string;
    transportMode?: string;
    shipmentPlanNo?: string;
    generatedBy?: string;
    totalDeliveryCost?: string;
    totalVins?: string;
    exportDraftPlan?: any[];
}
export interface CancelChart {
    id?: number;
    loadNo?: string;
    city?: string;
    quantity?: string;
    vlsp?: string;
    plannedLocation?: string;
    transportMode?: string;
    shipmentNo?: string;


}

export interface Dropdown {
    id?: string;
    name?: string;
}
export interface spno {
    id?: string;
}
export interface SummaryChart_1 {
    id?: number;
    city?: string;
    model?: string;
    quantity?: string;
    transportMode?: string;
    sourceCity?: string[];
    totalCount?: number;
    values?: number[];
}

export interface InvalidList {
    vin?: string;
    allocatedDealer?: string;
    defaultVSC?: string;
    costAtLocation?: string;
    currentLocation?: string;

    destinationCity?: string;
    sourceCity?: string;
    distance?: string;
    quantity?: string;
    transportMode?: string;
    vlsp?: string;
    model?: string;
    price?: string;
    insurance?: string;
    priceType?: string;
}

export interface ExportExcel {
    shipmentPlanNo?: string,
    loadNo?: string,
    vin?: string,
    vin_Cost?: string,
    plannedLocation?: string,
    dealer?: string,
    destinationCity?: string,
    model?: string,
    vlsp?: string,
    transportMode?: string

}