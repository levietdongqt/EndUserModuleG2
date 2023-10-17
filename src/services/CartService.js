import baseRequest from "../contexts/AxiosContext";

export const getCartInfo = async (userID) => {
  try {
    const response = await baseRequest.get(`/upload/LoadCart?userID=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const uploadImages = async (formData) => {
  try {
    const templateID =  formData.get('templateID')
    console.log('Filesssss:', formData.get('files[0]'));
    if (templateID === 1) {
      const response = await baseRequest.post(`/upload/WithNoTemplate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Cần đặt Content-Type là 'multipart/form-data'
        },
      });
      return response;
    } else {
      const response = await baseRequest.post(`/upload/WithTemplate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Cần đặt Content-Type là 'multipart/form-data'
        },
      });
      console.log(response)
      return response;
    }

  } catch (error) {
    console.log(error.response)
    return error.response;
  }

};
export const deleteAllCart = async (userID) => {
  try {
    const response = await baseRequest.get(`/upload/deleteAllCart?userID=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }

};