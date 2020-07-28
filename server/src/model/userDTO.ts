export default class UserDTO {
  public id:number;

  public password:string;

  public email:string;

  // eslint-disable-next-line camelcase
  public created_at:Date;

  // eslint-disable-next-line camelcase
  public updated_at:Date;

  constructor(userData:any) {
    this.id = userData.id;
    this.password = userData.password;
    this.email = userData.email;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }
}