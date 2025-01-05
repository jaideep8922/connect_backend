import { sendSuccess, sendError } from '../utils/responseHandle';
import {  getStatusList  } from '../services/configService';


export const getAllStatus = async (req: any, res: any) => {
  try {
    const status = await getStatusList();
    sendSuccess(res, status, 'Status Fetch Successfully')
  } catch (error) {
    console.error('Error fetching Status:', error);
    sendError(res, 'error')
  }
};