import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext("");
export default function UserProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(null);

  async function getUserInfo() {
    try {
      const option = {
        url: "https://route-posts.routemisr.com/users/profile-data",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.request(option);
      if (data.success) {
        setUserInfo(data.data.user);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <userContext.Provider value={{ token, setToken, userInfo }}>
      {children}
    </userContext.Provider>
  );
}
