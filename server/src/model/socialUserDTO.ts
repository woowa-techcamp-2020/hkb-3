interface ISocialUser{
  id?:number,
  // eslint-disable-next-line camelcase
  social_id?:number,
  name?:string,
  // eslint-disable-next-line camelcase
  created_at?:Date,
  // eslint-disable-next-line camelcase
  updated_at?:Date,
}

/* eslint-disable camelcase */
export default class SocialUserDTO {
  public id:number;

  public social_id:number;

  public name:string;

  public created_at:Date;

  public updated_at:Date;

  constructor(userData:ISocialUser) {
    this.id = userData.id as number;
    this.social_id = userData.social_id as number;
    this.name = userData.name as string;
    this.created_at = userData.created_at as Date;
    this.updated_at = userData.updated_at as Date;
  }

  getId() {
    return this.id;
  }

  getSocialId() {
    return this.social_id;
  }

  getName() {
    return this.name;
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

  setSocialId(social_id:number) {
    this.social_id = social_id;
  }

  setName(name:string) {
    this.name = name;
  }

  setCreatedAt(created_at:Date) {
    this.created_at = created_at;
  }

  setUpdatedAt(updated_at:Date) {
    this.updated_at = updated_at;
  }
}