import { Navigate } from "react-router-dom";

function PrivateRoute({ children, jwtToken }: {children: any, jwtToken: string}) {
  return jwtToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;