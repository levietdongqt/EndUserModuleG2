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

export const deleteAllCart = async (userID) => {
  try {
    const response = await baseRequest.get(`/upload/deleteAllCart?userID=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }

};