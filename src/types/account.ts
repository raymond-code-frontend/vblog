import { Types } from 'mongoose';

export enum ERole {
  Owner = '1',
  Manager = '2',
  Member = '3',
  Pending = '0',
  Blocked = '-1'
}

export enum EToken {
  AccessToken = 'access',
  RefreshToken = 'refresh'
}

export interface IAccount extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  avatar?: string | null;
  name: string;
  role?: ERole[];
  createdAt?: Date;
  updatedAt?: Date | null;
  refreshToken?: string | null;
}
