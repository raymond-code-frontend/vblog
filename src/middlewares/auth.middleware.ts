import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { ERole, EToken } from '../types/account';
import AccountModel from '../models/account.model';

export const verifyTokenReturnId = (tokenKey?: EToken) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');
    let key = '';
    switch (tokenKey) {
      case EToken.AccessToken:
        key = process.env.ACCESS_TOKEN_KEY!;
        break;
      case EToken.RefreshToken:
        key = process.env.REFRESH_TOKEN_KEY!;
        break;
      default:
        break;
    }
    try {
      const decoded: any = jwt.verify(token, key);
      if (decoded && decoded.id) {
        req.id = decoded.id;
        next();
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.log('Token Expired Error');
        res.status(401).send('Token Expired Error');
      } else {
        console.log(error);
        res.status(500).send('Unexpected Error');
      }
    }
  };
};

// export const verifyTokenReturnId =

export const checkRole = (role?: ERole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req;
      if (!id) {
        return res.status(400).send('Bad Request');
      }
      const account = await AccountModel.findById(id);
      if (!account) {
        return res.status(400).send('Bad Request');
      }
      if (account.role !== role) {
        return res.status(403).send('Forbidden');
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send('Unexpected Error');
    }
  };
};
