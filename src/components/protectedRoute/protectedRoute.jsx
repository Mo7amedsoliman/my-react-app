import { useContext } from "react";
import { userContext } from "../../context/User.context";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(userContext);
  if (!token) {
    return <Navigate to={"/login"} />;
  } else {
    return children;
  }
}
