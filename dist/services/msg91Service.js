"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MSG91 = require("msg91")("YOUR_AUTH_KEY", "SENDER_ID", "ROUTE_NO");
/**
 * Send SMS via MSG91
 * @param {string} phone - Recipient phone number
 * @param {string} message - Message to send
 */
const sendSMSMsg91 = (phone, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield MSG91.send(phone, message);
        console.log(`SMS sent to ${phone}`);
    }
    catch (error) {
        console.error("Error sending SMS:", error);
    }
});
exports.default = sendSMSMsg91;
// module.exports = { sendSMS: sendSMSMsg91 };
