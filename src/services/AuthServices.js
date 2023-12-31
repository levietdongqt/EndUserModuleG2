import axios from "axios";

export const Register = async (userDTO) => {
  return await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/User/Create`,
    {
      userDTO
    }
  );
};

export const Login = async (email, password) => {
  console.log(`Email : ${email} - ${password}`)
  console.log(`Domain: ${process.env.REACT_APP_API_BASE_URL}`)
  const isClient = true;
  return await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
    email,
    password,
    isClient
  });
}
export const OAuth2Request = async (access_token) => {
  console.log(access_token);
  return await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/auth/handle-google-response`,
    { access_token }
  );
};
