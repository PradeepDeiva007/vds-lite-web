import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shipmentPlan'
})
export class ShipmentPlan implements PipeTransform {

  transform(value: string): any {
    let newValue = value.split("~")
    return newValue[1] !== "0" ? newValue[1] : ""
  }

}
