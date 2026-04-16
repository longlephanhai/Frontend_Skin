import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/client/home";
import LayoutAdmin from "./pages/admin/layout";
import UserPage from "./pages/admin/user";
import DashBoardPage from "./pages/admin/dashboard";
import LoginPage from "./pages/client/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: <DashBoardPage />
      },
      {
        path: "user",
        element: <UserPage />
      }
    ]
  }
]);

function App() {


  return (
    <RouterProvider router={router} />
  )
}

export default App
