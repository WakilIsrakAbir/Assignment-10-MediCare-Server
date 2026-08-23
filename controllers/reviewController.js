import Review from '../models/Review.js';
import Doctor from '../models/Doctor.js';

// Get Featured Reviews for Homepage
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
    return res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
  }
};

// Add Review (Patient)
export const addReview = async (req, res) => {
  try {
    const { doctorId, rating, reviewText } = req.body;
    const user = req.user;

    if (!doctorId || !rating || !reviewText) {
      return res.status(400).json({ success: false, message: 'Please provide doctor, rating and review text.' });
    }

    const review = await Review.create({
      patientId: user._id,
      patientName: user.name,
      patientPhoto: user.Photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      patientRole: 'Verified Patient',
      doctorId,
      rating: Number(rating),
      reviewText,
    });

    // Update Doctor's total reviews and average rating
    const allDoctorReviews = await Review.find({ doctorId });
    const avgRating = (allDoctorReviews.reduce((acc, curr) => acc + curr.rating, 0) / allDoctorReviews.length).toFixed(1);
    await Doctor.findByIdAndUpdate(doctorId, {
      rating: Number(avgRating),
      totalReviews: allDoctorReviews.length,
    });

    return res.status(201).json({ success: true, message: 'Review added successfully!', data: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
  }
};

// Get My Reviews (Patient)
export const getMyReviews = async (req, res) => {
  try {
    const patientId = req.user._id;
    const reviews = await Review.find({ patientId })
      .populate('doctorId', 'doctorName specialization hospitalName profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch your reviews', error: error.message });
  }
};

// Update Review (Patient)
export const updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      { rating: Number(rating), reviewText },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    return res.status(200).json({ success: true, message: 'Review updated successfully', data: review });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update review', error: error.message });
  }
};

// Delete Review (Patient)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, patientId: req.user._id });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    return res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
  }
};
