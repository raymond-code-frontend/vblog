import { Schema, model } from 'mongoose';
import { type IAccount, ERole } from '../types/account';

const AccountSchema = new Schema<IAccount>({
  username: {
    type: String,
    required: true,
    unique: true,
    min: 8
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: Object.values(ERole),
    default: ERole.Member
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: null
  },
  refreshToken: {
    type: String,
    default: null
  }
});

const AccountModel = model('account', AccountSchema);

export default AccountModel;
