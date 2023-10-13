import axios from 'axios';

export const getAllize = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Size`);
    return data;
};



