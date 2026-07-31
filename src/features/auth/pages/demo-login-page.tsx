import LoginForm from "../components/login-form";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";



const DemoLoginPage = () => {
  const { user, isLoading } = useAuth();

  console.log("DemoLoginPage", { user, isLoading });
  return (
    <div>
      <h1>Demo Login Page</h1>
      <Link to={ROUTES.HOME}>Back to home</Link>
      <br />
      <Link to={ROUTES.LOGIN}>Back to login</Link>
      <br />
      <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
      <br />
      <LoginForm />
    </div>
  );
};
export default DemoLoginPage;
