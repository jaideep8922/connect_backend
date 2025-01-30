"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const reviewAndRatingController_1 = require("../controllers/reviewAndRatingController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.post('/add-review', reviewAndRatingController_1.addReviewAndRating);
app.post('/get-review', reviewAndRatingController_1.getReviewList);
exports.default = app;
