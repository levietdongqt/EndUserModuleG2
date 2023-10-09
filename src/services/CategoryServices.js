import axios from 'axios';

export const getAllCategories = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Category`);
    return data;
};

export const getCategoryById = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Category/${id}`);
    return data;
};

export const addCategory = async (name, genre, status) => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Category`, {
        name,
        genre,
        status
    });
    return data;
};

export const updateCategory = async (id, name, genre, status) => {
    const { data } = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/Category/${id}`, {
        name,
        genre,
        status
    });
    return data;
};

export const deleteCategory = async (id) => {
    const { data } = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/Category/${id}`);
    return data;
};