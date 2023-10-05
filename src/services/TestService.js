import baseRequest from "../contexts/AxiosContext";

export const testRequest = async () =>{
  try {
   const response = await baseRequest.get(`/User/admins`);
   return response;
  } catch (error) {
    console.log(error.response)
    return error.response;
  }
  
};