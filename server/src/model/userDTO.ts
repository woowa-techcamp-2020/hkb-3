/* eslint-disable camelcase */
export default class UserDTO {
  public id:number;

  public password:string;

  public email:string;

  public name:string;

  public created_at:Date;

  public updated_at:Date;
  
  constructor(userData:any) {
    this.id = userData.id;
    this.password = userData.password;
    this.email = userData.email;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
    this.name = userData.name;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getPassword() {
    return this.password;
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

  setName(name:string) {
    this.name = name;
  }
  
  setEmail(email:string) {
    this.email = email;
  }

  setPassword(password:string) {
    this.password = password;
  }

  setCreatedAt(created_at:Date) {
    this.created_at = created_at;
  }

  setUpdatedAt(updated_at:Date) {
    this.updated_at = updated_at;
  }
}