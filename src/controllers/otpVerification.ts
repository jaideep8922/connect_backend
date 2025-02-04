// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
// const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
// const MSG91_URL = 'https://control.msg91.com/api/v5/otp';

// export const sendOTP = async (phone: string) => {
//   try {
//     const response = await axios.post(MSG91_URL, {
//       authkey: MSG91_AUTH_KEY,
//       mobile: phone,
//       sender: MSG91_SENDER_ID,
//       otp_length: 6,
//       otp_expiry: 10 // OTP expiry in minutes
//     });

//     return response.data;
//   } catch (error) {
//     throw new Error(`Error sending OTP: ${error}`);
//   }
// };

// export const verifyOTP = async (phone: string, otp: string) => {
//   try {
//     const response = await axios.post(`${MSG91_URL}/verify`, {
//       authkey: MSG91_AUTH_KEY,
//       mobile: phone,
//       otp
//     });

//     return response.data;
//   } catch (error) {
//     throw new Error(`Error verifying OTP: ${error}`);
//   }
// };



// import { Request, Response } from 'express';
// import prisma from '../prisma/prismaClient';

// export const sendOtpController = async (req: any, res: any) => {
//   try {
//     const { phone } = req.body;
    
//     if (!phone) return res.status(400).json({ error: "Phone number is required" });

//     // Check if the user exists in Retailer or Seller
//     const user = await prisma.retailer.findUnique({ where: { phone } }) || 
//                  await prisma.seller.findUnique({ where: { phone } });

//     if (!user) return res.status(404).json({ error: "User not found" });

//     const response = await sendOTP(phone);
//     res.status(200).json({ message: "OTP sent successfully", response });
//   } catch (error:any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const verifyOtpController = async (req: any, res: any) => {
//   try {
//     const { phone, otp } = req.body;

//     if (!phone || !otp) return res.status(400).json({ error: "Phone number and OTP are required" });

//     const response = await verifyOTP(phone, otp);
    
//     if (response.type === "success") {
//       res.status(200).json({ message: "OTP verified successfully" });
//     } else {
//       res.status(400).json({ error: "Invalid OTP" });
//     }
//   } catch (error:any) {
//     res.status(500).json({ error: error.message });
//   }
// };



const express = require("express");
const { sendSMS } = require("../services/msg91Service");
import sendSMSMsg91 from '../services/msg91Service'
import prisma from '../prisma/prismaClient';
const router = express.Router();

// Function to check user role and send SMS

export const sendOtpController = async (req: any, res: any) => {
    const { phone } = req.body;

  try {
    // Check if user exists in Seller, Retailer, or Guest
    const seller = await prisma.seller.findUnique({ where: { phone } });
    const retailer = await prisma.retailer.findUnique({ where: { phone } });
    const guest = await prisma.guest.findUnique({ where: { phone } });

    let userRole = "";
    let message = "";

    if (seller) {
      userRole = "Seller";
      message = `Hello ${seller.businessOwner}, welcome back to our seller platform!`;
    } else if (retailer) {
      userRole = "Retailer";
      message = `Hello ${retailer.businessOwner}, thank you for being a retailer with us!`;
    } else if (guest) {
      userRole = "Guest";
      message = `Welcome, guest! Explore our platform and become a part of our community.`;
    } else {
      return res.status(404).json({ error: "User not found" });
    }

    // Send SMS
    await sendSMSMsg91(phone, message);

    res.json({ message: `SMS sent successfully to ${userRole}` });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = router;
