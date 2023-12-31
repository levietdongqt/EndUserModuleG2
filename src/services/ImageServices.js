import baseRequest from "../contexts/AxiosContext";

export const getMyImages = async (userID) => {
  try {
    const response = await baseRequest.get(`/upload/LoadMyImages?userID=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const deleteImages = async (imageIdList) => {
  try {
    const response = await baseRequest.post(`/upload/deleteImages`,imageIdList);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const deleteMyImage = async (myImmageId,userId) => {
  try {
    const response = await baseRequest.delete(`/upload/deleteMyImage?myImmageId=${myImmageId}&userId=${userId}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const getNoTemplate = async (userID) => {
  try {
    const response = await baseRequest.get(`/upload/LoadNoTemplate?userID=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const getMaterialPage = async () => {
  try {
    const response = await baseRequest.get(`/MaterialPage`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const uploadImages = async (formData) => {
  try {
    const templateID =  formData.get('templateID')
    console.log("templateID",templateID)
    if (templateID === "1") {
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

export const LoadImagesByTemplateIdAsync = async (templateID,userID) => {
  try {
    const response = await baseRequest.get(`/upload/LoadMyImagesByTemplateId?templateId=${templateID}&userId=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};