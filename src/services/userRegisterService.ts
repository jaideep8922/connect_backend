import prisma from '../prisma/prismaClient';
import QRCode from 'qrcode';
import { Request, Response } from 'express';
import twilio from "twilio";
import jwt from 'jsonwebtoken';


const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes expiry
const otpStorage = new Map<string, { otp: string; expiresAt: number }>();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Helper function to generate JWT
const generateJWT = (userId: number, phone: string, customId:any) => {
  return jwt.sign({ userId, phone,customId  }, JWT_SECRET, { expiresIn: '1h' });
};


// Send OTP API
export const sendOtp = async (req: any, res: any) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage.set(phone, { otp, expiresAt: Date.now() + OTP_EXPIRY });

    // Send OTP via Twilio
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};



export const verifyOtp = (req: any, res: any) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const storedOtpData = otpStorage.get(phone);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found. Request a new one." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStorage.delete(phone); // Remove expired OTP
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, delete from storage
    otpStorage.delete(phone);

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};


export const verifyOtpForReloginSeller = async (req: any, res: any) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const storedOtpData = otpStorage.get(phone);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found. Request a new one." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStorage.delete(phone); // Remove expired OTP
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, delete from storage
    otpStorage.delete(phone);
    const phoneWithoutCountryCode = phone.replace(/^(\+91)/, ''); // Remove the +91 country code


    let user = await prisma.seller.findUnique({
      where: { phone: phoneWithoutCountryCode },
    });
    

    console.log("user", user)


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT after successful OTP verification
    const token = generateJWT(user.id, user.phone, user.customId);
    console.log("verify-otp-relogin", token);
    const userId = user.customId

    res.status(200).json({ user: user, token });

    // res.status(200).json({
    //   message: "OTP verified successfully",
    //   token,
    //   userId,
    //   user,
    //   { user: user, token }
    // });
  } catch (error) {
    console.error("Error verifying OTP for relogin:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};

export const verifyOtpForReloginRetailer= async (req: any, res: any) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const storedOtpData = otpStorage.get(phone);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found. Request a new one." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStorage.delete(phone); // Remove expired OTP
      return res.status(400).json({ message: "OTP expired. Request a new one." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, delete from storage
    otpStorage.delete(phone);

    // Check if the phone exists in the Retailer model
    let user = await prisma.retailer.findUnique({
      where: { phone },
    });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT after successful OTP verification
    const token = generateJWT(user.id, user.phone, user.customId);
    console.log("verify-otp-relogin", token);

    res.status(200).json({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("Error verifying OTP for relogin:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
};




const generateCustomId = (userType: string): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const suffix = userType === "Retailer" ? "RE" : userType === "Supplier" ? "SU" : null;

  if (!suffix) {
    throw new Error("Invalid userType for customId generation");
  }

  return `${suffix}-${randomNumber}`;
};

// const baseUrl = 'http://192.168.0.105:3000/onboard';
const baseUrl = 'https://connect-frontend-iu5s-git-main-jaideeps-projects-8e71adbe.vercel.app/'

export const addUser = async (userData: any) => {
  try {
    const {
      userType,
      sellerId,
      businessName,
      businessOwner,
      phone,
      gstNumber,
      shopMarka,
      transport,
      pincode,
      city,
      state,
      filePath,
      qrCodeSelf
    } = userData;

    const customId = generateCustomId(userType);

    if (userType === 'Retailer') {
      if (!sellerId) {
        throw new Error('sellerId is required to map Retailer to a Supplier.');
      }

      const supplierExists = await prisma.seller.findUnique({
        where: { customId: sellerId },
      });

      if (!supplierExists) {
        throw new Error(`Supplier with ID ${sellerId} does not exist.`);
      }

      // Include the supplier's customId in the QR code payload
      const qrCodeUrl = `${baseUrl}?type=retailer&id=${customId}&supplierId=${sellerId}`;
      const qrCode = await QRCode.toDataURL(qrCodeUrl);

      const retailerData = {
        sellerId,
        customId,
        qrCode,
        businessName,
        businessOwner,
        phone,
        gstNumber,
        shopMarka,
        transport,
        pincode,
        city,
        state,
        filePath
      };

      const retailer = await prisma.retailer.create({
        data: retailerData,
      });

      return { message: 'Retailer added successfully', data: retailer };
    }

    if (userType === 'Supplier') {
      const qrCodeSupplierUrl = `${baseUrl}?id=${customId}`;
      const qrCodeSupplier = await QRCode.toDataURL(qrCodeSupplierUrl);

      // const qrCodeSupplierSelfUrl = `${baseUrl}?type=supplier&supplierId=${sellerId}`;
      const qrCodeSupplierSelfUrl = `${baseUrl}?type=supplier&customId=${customId}&timestamp=${Date.now()}`;

      const qrCodeSelfSupplier = await QRCode.toDataURL(qrCodeSupplierSelfUrl);


      console.log("qrCodeSupplier", qrCodeSupplier)
      console.log("qrCodeSelfSupplier", qrCodeSelfSupplier)

      const supplierData = {
        customId,
        qrCode: qrCodeSupplier,
        qrCodeSelf : qrCodeSelfSupplier,
        businessName,
        businessOwner,
        phone,
        gstNumber,
        shopMarka,
        transport,
        pincode,
        city,
        state,
        filePath
      };

      const supplier = await prisma.seller.create({
        data: supplierData,
      });

      return { message: 'Supplier added successfully', data: supplier };
    }

    throw new Error('Invalid userType');
  } catch (error) {
    console.error('Error adding user to database:', error);
    throw new Error('Failed to add user');
  }
};

export const fetchRetailerById = async (customId: string) => {
  try {
    const user = await prisma.retailer.findUnique({
      where: { customId },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
};

export const fetchSellerById = async (customId: string) => {
  try {
    const user = await prisma.seller.findUnique({
      where: { customId },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
};
