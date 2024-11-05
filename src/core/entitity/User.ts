import { Permission } from "./Permission";

export class RawUser {
  public id: string;
  public name: string;
  public email: string;
  public avatar: string;
  public roleId: number;
  public role_name: string;
  public verify: boolean;
  public permission: Permission[];

  constructor(data: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    roleId: number;
    role_name: string;
    verify: boolean;
    permission: Permission[];
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.roleId = data.roleId;
    this.role_name = data.role_name;
    this.verify = data.verify;
    this.permission = data.permission;
  }
}

export class TokenUser {
  constructor(public id : string){}
}

export class User {
  id: string;
  name: string;
  verify: boolean;
  email: string;
  avatar: string;
  role_name: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.verify = data.verify;
    this.email = data.email;
    this.avatar = data.avatar;
    this.role_name = data.role.role_name;
  }
}

export class AuthUser {
  id: string;
  name: string;
  verify: boolean;
  email: string;
  password: string;
  provider : string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.verify = data.verify;
    this.provider = data.provider;
    this.password = data.password;
  }
}


export class OauthUser {
  name : string;
  email : string;

  constructor(data : any) {
    this.name = data.name;
    this.email = data.email;
  }
}
