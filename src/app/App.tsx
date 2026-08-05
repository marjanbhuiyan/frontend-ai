import { AppProviders } from "./AppProviders";
import { Bootstrap } from "./Bootstrap";
import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
    { path: "/", element: <div>Home</div> },
    { path: "/login", element: <div>Login</div> },
    { path: "/register", element: <div>Register</div> },
    { path: "/dashboard", element: <div>Dashboard</div> },
]);

export default function App() {
  return (
    <AppProviders>
      <Bootstrap>
        <RouterProvider router={router} />
      </Bootstrap>
    </AppProviders>
  );
}