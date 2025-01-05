import { sendSuccess, sendError } from '../utils/responseHandle';
import { saveReviewAndRating , getReatilersReviewList ,getSupliersReviewList} from '../services/reviewAndRatingService';
import { Request, Response } from 'express';

export const addReviewAndRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            orderId,
            review,
            ratingStars,
        } = req.body;

        // Add order logic
        const saveReview = await saveReviewAndRating({
            orderId,
            review,
            ratingStars,
        });

        // Success response
        sendSuccess(res, saveReview.data, saveReview.message);
    } catch (error) {
        console.error('Error Adding Review:', error);
        sendError(res, 'An error occurred while adding the Review.');
    }
};


export const getReviewList = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            retailerId,
            suplierId,
            userType,
        } = req.body;

        let getReviewList = null;

        if (userType === 'Retailer') {
            getReviewList = await getReatilersReviewList({ retailerId });
        } else if (userType === 'Supplier') {
            getReviewList = await getSupliersReviewList({ suplierId });
        } else {
            sendError(res, 'Invalid user type provided.');
            return; // Explicitly terminate function execution
        }

        sendSuccess(res, getReviewList.data, getReviewList.message);
    } catch (error) {
        console.error('Error Getting Review:', error);
        sendError(res, 'An error occurred while getting the review.');
    }
};

