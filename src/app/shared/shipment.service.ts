import { group } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable()
export class ShipmentService {


  constructor(private appService: AppService) { }

  searchShipment(groupName: string): Observable<any> {
    return this.appService.getResource(`shipment/search?authGroup=${groupName}`);
  }

  getSummaryChart(id: string): Observable<any> {
    return this.appService.getResource(`shipment/summarychart/${id}`);
  }
  getShipmentPlanapprovalWaiting(id:string,userId?:string): Observable<any>{
    return this.appService.getResource(`shipmentapproval/search/${id}?user=${userId}`);
  } 
  ApproveShipmentPlan(groupName?: string,userId?:string,shipmentplanNumber?: string[],approvalcoments?:string) {
    return this.appService.postResource(`shipmentapproval/approve/${groupName}?id=${userId}&comment=${approvalcoments}`,shipmentplanNumber)
   }
  RejectShipementPlan(groupName?: string,userId?:string,shipmentplanNumber?: string[],approvalcoments?:string){
    return this.appService.postResource(`shipmentapproval/reject/${groupName}?id=${userId}&comment=${approvalcoments}`,shipmentplanNumber)
  }
  getDraftShipmentPlan(authGrp: string): Observable<any> {
    return this.appService.getResource(`shipmentPlan/search/?authGroup=${authGrp}`)
  }

  getSummaryChartPlan(number: string, authGrp: string, planNo: string[], screenType: string): Observable<any> {
    return this.appService.getResource(`shipmentPlan/summaryChart/${authGrp}?chart=${number}&screen=${screenType}&planList=${planNo}`)
  }

  generateShipementPlan(planNo?: string, groupName?: string, userId?: string) {
    return this.appService.postResource(`shipmentPlan/create/${groupName}?id=${userId}&shipmentPlanNo=${planNo}`, null)
  }

  cancelShipementPlan(planNo?: string, groupName?: string, userId?: string) {
    return this.appService.postResource(`shipmentPlan/cancel/${groupName}?id=${userId}&shipmentPlanNo=${planNo}`, null)
  }

  removeLoadNumber(planNo?: string, groupName?: string, userId?: string, loadNumber?: (string | undefined)[]) {
    return this.appService.postResource(`shipmentPlan/remove/${groupName}?id=${userId}&shipmentPlanNo=${planNo}`, loadNumber)
  }

  searchCancel(groupName: string,cancelPlan : string): Observable<any> {
    return this.appService.getResource(`shipmentPlanCancel/search?authGroup=${groupName}&planNo=${cancelPlan}`);
  }

  postcancelPlan(planNo?: string, groupName?: string, userId?: string, approvalcoments?: string){
    return this.appService.postResource(`shipmentPlanCancel/cancelPlan/${groupName}?id=${userId}&shipmentPlanNo=${planNo}&comment=${approvalcoments}`, null);
  }

  createDraftPlan(groupName?: string, type?: string[], userId?: string,validate?: string){ 
    return this.appService.postResource(`shipmentPlan/generate/${groupName}?id=${userId}&check=${validate}`,type);
  }
  getcancelShipmentPlanapprovalWaiting(id:string,userId:string): Observable<any>{
    return this.appService.getResource(`cancelshipmentapproval/cancelsearch/${id}?user=${userId}`);
  } 
  CancelApproveShipmentPlan(groupName?: string,userId?:string,shipmentplanNumber?: string[],approvalcoments?:string) {
    return this.appService.postResource(`cancelshipmentapproval/cancelapprove/${groupName}?id=${userId}&comment=${approvalcoments}`,shipmentplanNumber)
  }
   cancelRejectShipmentPlan(groupName?: string,userId?:string,shipmentplanNumber?: string[],approvalcoments?:string){
    return this.appService.postResource(`cancelshipmentapproval/cancelreject/${groupName}?id=${userId}&comment=${approvalcoments}`,shipmentplanNumber)
  }
  loadcancelShipmentPlan(groupName: string): Observable<any>{
    return this.appService.getResource(`shipmentPlanCancel/load/${groupName}`);
  } 

}