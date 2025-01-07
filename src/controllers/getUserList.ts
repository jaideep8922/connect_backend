import { PrismaClient } from "@prisma/client";
import { sendSuccess } from "../utils/responseHandle";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
const prisma = new PrismaClient();
const JWT_SECRET = 'your_secret_key_here';



export const getRetailersBySellerId = async (req: any, res: any) => {
  try {
    const { sellerId } = req.body;
    // Validation
    if (!sellerId) {
      return res.status(400).json({ error: "Missing seller ID" });
    }
    const retailers = await prisma.retailer.findMany({
      where: { sellerId },
      select: {
        id: true,
        businessName: true,
        businessOwner: true,
        phone: true,
        gstNumber: true,
        shopMarka: true,
        transport: true,
        pincode: true,
        city: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!retailers || retailers.length === 0) {
      return res.status(404).json({ error: "No retailers found for the given seller ID" });
    }
    sendSuccess(res, retailers, 'Retailers fetched successfully');
  } catch (error) {
    console.error("Error fetching retailers by seller ID:", error);
    return res.status(500).json({ error: "Error fetching retailers" });
  }
};

export const adminRegister = async (req: any, res: any) => {
    try {
      const { email, password, name, phone }: any = req.body;
  
      if (!email || !password || !name || !phone) {
        return res.status(400).json({ error: 'Email, password, name, and phone are required' });
      }
  
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: email },
      });
  
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin with this email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone,
        },
      });
  
      const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
        expiresIn: '1h',
      });
      sendSuccess(res, token, 'Registration successful');
  
      
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
export const adminLogin = async (req: any, res: any) => {
  try {
    const { email, password }: any= req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    if (!admin) {
      return res.status(404).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '1h',
    });
    sendSuccess(res, token, 'Login successful');
 
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};