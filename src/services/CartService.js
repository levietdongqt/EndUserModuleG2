import baseRequest from "../contexts/AxiosContext";

export const payPalPayment = async (orderDTO) => {
  try {
    console.log("orderDTO",orderDTO)
    const response = await baseRequest.post(`/Cart/payPalPayment`,orderDTO);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};
export const directPayment = async (orderDTO) => {
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
export const addToCartAllSimple = async (formData) => {
  try {
    const response = await baseRequest.post(`/Cart/addToCartAllSimple`,formData);
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
    const response = await baseRequest.delete(`/Cart/deleteItem?productDetailID=${productId}`);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
};

export const deleteAllCart = async (productIdList) => {
  try {
    console.log(productIdList)
    const response = await baseRequest.put(`/Cart/deleteAll`,productIdList);
    return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }

};