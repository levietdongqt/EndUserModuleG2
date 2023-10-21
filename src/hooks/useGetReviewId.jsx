import { useEffect, useState } from 'react';
import { getUserById } from '../services/UserServices';

const useGetReviewId = (userId, productId) => {
    const [Review, setReviewId] = useState(null);

    useEffect(() => {
        if (userId && productId) {
            getUserById(userId)
                .then((result) => {
                    if(result.result.status === 'Enabled'){
                        result.result.reviews.forEach((item) => {
                            if (item.templateId === productId) {
                                setReviewId(item.id);
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi tải dữ liệu người dùng:', error);
                    // Xử lý lỗi ở đây
                });
        }
    }, [userId, productId]);

    return [Review];
}

export default useGetReviewId;