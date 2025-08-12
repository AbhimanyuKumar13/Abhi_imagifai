import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default PrivateRoute;
