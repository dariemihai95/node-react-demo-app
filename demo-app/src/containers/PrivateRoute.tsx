import { Navigate } from "react-router-dom";
import { isAuth } from "../utils/authManager";

const isLoggedIn = isAuth();

function PrivateRoute({ children }: any) {
  return isLoggedIn ? children : <Navigate to="/login" />;
}

export default PrivateRoute;