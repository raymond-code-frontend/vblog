import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { type Types } from 'mongoose';

export const generateToken = (id: Types.ObjectId) => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY!, {
    expiresIn: '1h'
  });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY!, {
    expiresIn: '7d'
  });

  return { accessToken, refreshToken };
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
