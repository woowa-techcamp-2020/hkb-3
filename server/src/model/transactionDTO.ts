/* eslint-disable camelcase */
export default class TransactionDTO {
  public id:number;

  public contents:string;

  public date:Date;

  public amount:number;

  public category_id:number;

  public payment_id:number;

  public user_id:number;

  public created_at:Date;

  public updated_at:Date;

  constructor(transactionData:any) {
    this.id = transactionData.id;
    this.contents = transactionData.contents;
    this.date = transactionData.date;
    this.category_id = transactionData.category_id;
    this.amount = transactionData.amount;
    this.user_id = transactionData.user_id;
    this.payment_id = transactionData.payment_id;
    this.created_at = transactionData.created_at;
    this.updated_at = transactionData.updated_at;
  }

  getId() {
    return this.id;
  }

  getContents() {
    return this.contents;
  }

  getDate() {
    return this.date;
  }

  getCategoryId() {
    return this.category_id;
  }

  getAmount() {
    return this.amount;
  }

  getUserId() {
    return this.user_id;
  }

  getPaymentId() {
    return this.payment_id;
  }

  getCreatedAt() {
    return this.created_at;
  }

  getUpdatedAt() {
    return this.updated_at;
  }

  setId(id:number) {
    this.id = id;
  }

  setContents(contents:string) {
    this.contents = contents;
  }

  setDate(date:Date) {
    this.date = date;
  }

  setCategoryId(category_id:number) {
    this.category_id = category_id;
  }

  setAmount(amount:number) {
    this.amount = amount;
  }

  setUserId(user_id:number) {
    this.user_id = user_id;
  }

  setPaymentId(payment_id:number) {
    this.payment_id = payment_id;
  }

  setCreatedAt(created_at:Date) {
    this.created_at = created_at;
  }

  setUpdatedAt(updated_at:Date) {
    this.updated_at = updated_at;
  }
}