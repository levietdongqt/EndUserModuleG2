import { createContext, useState, useContext } from "react";


const MyImageContext = createContext();
export const MyImageProvider = ({ children }) => {

  const [myImageCookie, setMyImageCookie] = useState([]);
  const values = {
    myImageCookie,
    setMyImageCookie
  }

  return <MyImageContext.Provider value={values} >{children}</MyImageContext.Provider>
};

export const useMyImageContext = () => useContext(MyImageContext);