import axios from 'axios';

export const getAllMaterialPage = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/MaterialPage`);
    return data;
};

