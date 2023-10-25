import axios from 'axios';

export const getAllTemplate = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/Template`);
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

export const addTemplate = async (name, status) => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/Template`, {
        name,
        status
    });
    return data;
};

export const updateTemplate = async (id, name, status) => {
    const { data } = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/Template/${id}`, {
        name,
        status
    });
    return data;
};

export const deleteTemplate = async (id) => {
    const { data } = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/Template/${id}`);
    return data;
};