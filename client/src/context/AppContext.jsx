import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credit, setCredit] = useState(null); 

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); 
 
  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        withCredentials: true,
      });
      if (data.success) {
        setCredit(data.credits);
      }
    } catch (error) {
      console.error("loadCreditsData error:", error);
      toast.error(error.response?.data?.message || "Failed to load credits");
    }
  };
 
  const generateImage = async (prompt) => {
    if (!user) {
      toast.error("User not logged in");
      return null;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/generate-image`,
        { prompt },
        { withCredentials: true }
      );

      if (data.success) {
        await loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        await loadCreditsData();
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
 
  const logout = async () => {
    try {
      await axios.get(`${backendUrl}/api/user/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error?.response?.data?.message || error.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setCredit(null);
    }
  };
 
  useEffect(() => { 
    axios
      .get(`${backendUrl}/api/user/me`, { withCredentials: true })
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      }) 
  }, []);
 
  useEffect(() => {
    if (user) {
      loadCreditsData();
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated,
    setIsAuthenticated,
    setUser,
    backendUrl,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage, 
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
