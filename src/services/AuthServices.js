import axios from 'axios';

export const Register = async (firstName, lastName, email, password, phone) =>{
    return await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register`,{
        firstName,
        lastName,
        email,
        password,
        phone
    });
};

export const Login = async (email, password)=>{
    console.log(`Email : ${email} - ${password}`)
    const isClient  = true;
    return await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`,{
        email,
        password,
        isClient
    });
};
export const OAuth2Request = async (access_token)=>{
    return await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/handle-google-response`,{access_token});
};