import { AreaModel } from './AreaModel';
import { LoanModel } from './LoanModel';
export class ActiveModel{
	idActive:number
	name:string
	licensePlate?:string
	description:string
	placeOrigin?:string
	mark?:string
	model?:string
	serie?:string 
	amount?:number
	isLoan?:number
	areas?:AreaModel[]
	loan? :LoanModel
}