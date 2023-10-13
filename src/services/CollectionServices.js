import axios from 'axios';

export const getAllCollection = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Collection`);
    return data;
};
export const getTemplateByCollection = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Collection/Template/${id}`);
    return data;
}
export const getCollectionById = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Collection/${id}`);
    return data;
};
