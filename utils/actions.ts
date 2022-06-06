import currency from "currency.js"

export function addNumbers(a:any, b:any){
    return currency(a).add(b).value;
}

export function divideNumber(number:any, divider:any){
    return currency(number).divide(divider).value;
}