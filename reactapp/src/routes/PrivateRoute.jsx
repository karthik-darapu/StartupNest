import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const storedToken = localStorage.getItem("token");

  if (!isAuthenticated && !storedToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
