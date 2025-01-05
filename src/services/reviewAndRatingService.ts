import prisma from '../prisma/prismaClient';

export const saveReviewAndRating = async (reviewDetails: any) => {
    try {
        const {
            orderId,
            review,
            ratingStars,
        } = reviewDetails;

        // Save the notes with the appropriate combination
        const reviewSaveObj = await prisma.reviewAndRating.create({
            data: {
                orderId,
                review,
                ratingStars,
            },
        });

        return { message: 'Review added successfully', data: reviewSaveObj };
    } catch (error) {
        console.error('Error adding Review to the database:', error);
        throw new Error('Failed to add Review. Please try again.');
    }
};

export const getReatilersReviewList = async (reviewObj: any) => {
    try {
        const { retailerId } = reviewObj;

        // Fetch reviews with the appropriate condition
        const reviewSaveObj = await prisma.reviewAndRating.findMany({
            where: { order: { retailerId: retailerId } }
        });

        return { message: 'Reviews fetched successfully', data: reviewSaveObj };
    } catch (error) {
        console.error('Error fetching reviews from the database:', error);
        throw new Error('Failed to fetch reviews. Please try again.');
    }
};

export const getSupliersReviewList = async (reviewObj: any) => {
    try {
        const { sellerId } = reviewObj;

        // Fetch reviews with the appropriate condition
        const reviewSaveObj = await prisma.reviewAndRating.findMany({
            where: { order: { sellerId: sellerId } }
        });

        return { message: 'Reviews fetched successfully', data: reviewSaveObj };
    } catch (error) {
        console.error('Error fetching reviews from the database:', error);
        throw new Error('Failed to fetch reviews. Please try again.');
    }
};
