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
exports.getReviewList = exports.addReviewAndRating = void 0;
const responseHandle_1 = require("../utils/responseHandle");
const reviewAndRatingService_1 = require("../services/reviewAndRatingService");
const addReviewAndRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, review, ratingStars, } = req.body;
        // Add order logic
        const saveReview = yield (0, reviewAndRatingService_1.saveReviewAndRating)({
            orderId,
            review,
            ratingStars,
        });
        // Success response
        (0, responseHandle_1.sendSuccess)(res, saveReview.data, saveReview.message);
    }
    catch (error) {
        console.error('Error Adding Review:', error);
        (0, responseHandle_1.sendError)(res, 'An error occurred while adding the Review.');
    }
});
exports.addReviewAndRating = addReviewAndRating;
const getReviewList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retailerId, suplierId, userType, } = req.body;
        let getReviewList = null;
        if (userType === 'Retailer') {
            getReviewList = yield (0, reviewAndRatingService_1.getReatilersReviewList)({ retailerId });
        }
        else if (userType === 'Supplier') {
            getReviewList = yield (0, reviewAndRatingService_1.getSupliersReviewList)({ suplierId });
        }
        else {
            (0, responseHandle_1.sendError)(res, 'Invalid user type provided.');
            return; // Explicitly terminate function execution
        }
        (0, responseHandle_1.sendSuccess)(res, getReviewList.data, getReviewList.message);
    }
    catch (error) {
        console.error('Error Getting Review:', error);
        (0, responseHandle_1.sendError)(res, 'An error occurred while getting the review.');
    }
});
exports.getReviewList = getReviewList;
