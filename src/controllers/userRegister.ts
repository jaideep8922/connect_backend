import { getUsers, addUser } from '../services/userRegisterService';
import { sendSuccess, sendError } from '../utils/responseHandle';

export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await getUsers();
    sendSuccess(res, users, 'User Fetch Successfully')
  } catch (error) {
    console.error('Error fetching users:', error);
    sendError(res, 'error')
  }
};

export const createUser = async (req: any, res: any) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required fields.',
      });
    }

    const newUser = await addUser({ email, name });
    sendSuccess(res, newUser, 'User Created Successfully')

  } catch (error) {
    console.error('Error creating user:', error);
    sendError(res, 'Error creating user', error)
  }
};