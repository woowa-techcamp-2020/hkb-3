/* eslint-disable camelcase */
export default class CategoryDTO {
  public id:number;

  public name:string;

  public state:string;

  constructor(categoryData:any) {
    this.id = categoryData.id;
    this.name = categoryData.name;
    this.state = categoryData.state;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getState() {
    return this.state;
  }

  setName(name:string) {
    this.name = name;
  }

  setState(state:string) {
    this.state = state;
  }
}