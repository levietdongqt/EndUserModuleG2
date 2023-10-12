import axios from "axios";
import baseRequest from "../contexts/AxiosContext";



export const Register = async (userDTO) => {

  return await baseRequest.post(
    `/User/Create`, userDTO
  );

};



//GETALL
export const getAllUsers = async (search, st, page, pageSize) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/User/GetAll`,
      {
        params: {
          search,
          st,
          page,
          pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

//GETUSER BYID
export const getUserById = async (id) => {
  const { data } = await baseRequest.get(`/User/${id}`);
  return data;
};

//EDIT USER
export const updateUser = async (formData) => {
  try {
    const response = await baseRequest.put(`/User/Edit`, formData);
    if (response.status === 200) {
      return response;
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


//CHANGE PASSWORD
export const changePassword = async (userDTO) => {
  const response = await baseRequest.put(
    `/User/ChangePass`,
    userDTO // Truyền requestData chứa cả userDTO, oldPassword, và newPassword
  );

  return response;
};

export const deleteUser = async (id) => {
  const { data } = await baseRequest.delete(`/users/${id}`);
  return data;
};

export const addFavorite = async (id, productId) => {
  const { data } = await baseRequest.post(`/users/${id}/favorite/${productId}`);
  return data;
};

export const deleteFavorite = async (id, productId) => {
  const { data } = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URL}/users/${id}/favorite/${productId}`
  );
  return data;
};
