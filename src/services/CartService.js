import baseRequest from "../contexts/AxiosContext";

export const createOrder = async (orderDTO) => {
  try {
    console.log("orderDTO",orderDTO)
    const response = await baseRequest.post(`/Cart/directPayment`,orderDTO);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const getCartInfo = async (userID) => {
  try {
    const response = await baseRequest.get(`/Cart/LoadCart?userID=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const addToCart = async (formData) => {
  try {
    const response = await baseRequest.post(`/Cart/AddToCart`,formData);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const updateToCart = async (productId, quantity) => {
  try {
    const response = await baseRequest.put(`/Cart/UpdateCart?productDetailID=${productId}&quantity=${quantity}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const deleteToCart = async (productId) => {
  try {
    const response = await baseRequest.put(`/Cart/UpdateCart?productDetailID=${productId}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};

export const deleteAllCart = async (userID) => {
  try {
    const response = await baseRequest.get(`/Cart/deleteAllCart?userID=${userID}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }

};