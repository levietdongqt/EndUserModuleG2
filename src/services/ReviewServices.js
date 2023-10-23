import baseRequest from '../contexts/AxiosContext';
import axios from 'axios';
export const getAllReview = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/ratings`);
    return data
};

export const getReviewById = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Review/${id}`);
    return data;
};


export const getRatingByProductId = async (productId) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/ratings/product/${productId}`);
    return data;
}

export const addReview = async (productId, userId, content, rating) => {
        const response = await baseRequest.post(`${process.env.REACT_APP_API_BASE_URL}/Review`, {
            templateId: productId,
            userId,
            content,
            rating,
        });
        return response;
};