import { useEffect, useState } from 'react';
import { getUserById } from '../services/UserServices';

const useGetReviewId = (userId, productId) => {

    const [ratingId, setRatingId] = useState("");
    const [commentId, setCommentId] = useState("");

    useEffect(() => {
        getUserById(userId)
            .then((result) => {
                result.result.reviews.forEach((rating) => {
                    if (rating.templateId === productId) { setRatingId(rating.id); }
                });
            });
        getUserById(userId)
            .then((result) => {
                result.result.reviews.forEach((comment) => {
                    if (comment.templateId === productId) { setCommentId(comment.id); }
                });
            });

    }, [userId, productId]);

    return [ratingId, commentId];
}

export default useGetReviewId;