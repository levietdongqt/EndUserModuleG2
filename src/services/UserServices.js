import axios from "axios";
import baseRequest from "../contexts/AxiosContext";

export const Register = async (userDTO) => {
  return await baseRequest.post(`/User/Create`, userDTO);
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
  const response = await baseRequest.put(`/User/Edit`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(response);
  if (response.status === 200) {
    return response;
  } else {
    throw new Error("Failed to update user");
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

//CONFIRM
export const confirm = async (userId, code) => {
  const response = await baseRequest.get(
    `/User/ConfirmEmail?userId=${userId}&code=${code}`,
    userId, code
  );

  return response;
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
