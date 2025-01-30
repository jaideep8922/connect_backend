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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupliersReviewList = exports.getReatilersReviewList = exports.saveReviewAndRating = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const saveReviewAndRating = (reviewDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, review, ratingStars, } = reviewDetails;
        // Save the notes with the appropriate combination
        const reviewSaveObj = yield prismaClient_1.default.reviewAndRating.create({
            data: {
                orderId,
                review,
                ratingStars,
            },
        });
        return { message: 'Review added successfully', data: reviewSaveObj };
    }
    catch (error) {
        console.error('Error adding Review to the database:', error);
        throw new Error('Failed to add Review. Please try again.');
    }
});
exports.saveReviewAndRating = saveReviewAndRating;
const getReatilersReviewList = (reviewObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { retailerId } = reviewObj;
        // Fetch reviews with the appropriate condition
        const reviewSaveObj = yield prismaClient_1.default.reviewAndRating.findMany({
            where: { order: { retailerId: retailerId } },
            include: {
                order: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { message: 'Reviews fetched successfully', data: reviewSaveObj };
    }
    catch (error) {
        console.error('Error fetching reviews from the database:', error);
        throw new Error('Failed to fetch reviews. Please try again.');
    }
});
exports.getReatilersReviewList = getReatilersReviewList;
const getSupliersReviewList = (reviewObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = reviewObj;
        // Fetch reviews with the appropriate condition
        const reviewSaveObj = yield prismaClient_1.default.reviewAndRating.findMany({
            where: { order: { sellerId: sellerId } },
            include: {
                order: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { message: 'Reviews fetched successfully', data: reviewSaveObj };
    }
    catch (error) {
        console.error('Error fetching reviews from the database:', error);
        throw new Error('Failed to fetch reviews. Please try again.');
    }
});
exports.getSupliersReviewList = getSupliersReviewList;
