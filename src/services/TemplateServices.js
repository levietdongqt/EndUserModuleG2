import axios from 'axios';

export const getAllTemplate = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Template`);
    return data;
};
export const getAllTemplates = async (query) => {

    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Template/getAllTemplate?${query}`);
    return data;
};
export const getTemplateById = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Template/${id}`);
    return data;
};
export const getTemplateBestller = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Template/bestSeller`);
    return data;
};
export const getTemplateByName = async (name, query) => {
    const encodedName = encodeURIComponent(name);

    // Kiểm tra "query" trước khi sử dụng nó
    const queryString = query ? `&${query}` : '';

    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Template/GetTemplateByName?name=${encodedName}${queryString}`);
    return data;
}


