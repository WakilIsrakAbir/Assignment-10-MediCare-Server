import Review from '../models/Review.js';

export const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .populate('doctorId', 'doctorName specialization hospitalName profileImage');

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};
