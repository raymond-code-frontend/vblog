import { Request, Response } from 'express';
import AccountModel from '../models/account.model';
import { type IAccount } from '../types/account';
import { hashPassword, comparePasswords, generateToken } from '../utils/helper';

export const register = async (req: Request, res: Response) => {
  const { username, password, name }: IAccount = req.body;
  if (!username.trim() || !password || !name.trim()) {
    return res.status(404).send('Missing username or password!');
  }
  try {
    const checkUser = await AccountModel.findOne({ username: username.trim().toLowerCase() });
    if (checkUser) {
      return res.status(409).send('Username existed!');
    }
    const hashedPassword = await hashPassword(password);
    const temp = {
      username: username.trim(),
      password: hashedPassword,
      name: name.trim()
    };
    const account = new AccountModel(temp);
    await account.save();

    return res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password }: IAccount = req.body;
  if (!username || !password) {
    return res.status(404).send('Missing username or password!');
  }
  try {
    const checkUser = await AccountModel.findOne({ username: username });
    if (!checkUser) {
      return res.status(409).send('Wrong username or password!');
    }
    const hashedPassword = checkUser.password;
    const isMatch = await comparePasswords(password, hashedPassword);
    if (!isMatch) {
      return res.status(409).send('Wrong username or password!');
    }
    const tokens = generateToken(checkUser._id);
    if (tokens.refreshToken) {
      checkUser.refreshToken = tokens.refreshToken;
      await checkUser.save();
    }

    return res.status(200).send(tokens);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.sendStatus(404);
    }
    const user = await AccountModel.findById(id);
    if (!user) {
      return res.sendStatus(404);
    }
    user.refreshToken = null;
    res.clearCookie('accessToken');
    await user.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { id } = req;
  try {
    const user = await AccountModel.findById(id);
    if (!user) {
      return res.sendStatus(404);
    }
    const tokens = generateToken(user._id);
    if (tokens.refreshToken) {
      user.refreshToken = tokens.refreshToken;
      await user.save();
    }
    res.status(200).send(tokens);
  } catch (error) {
    res.sendStatus(500);
  }
};
