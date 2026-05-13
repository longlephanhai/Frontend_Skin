import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./pages/client/home";
import LayoutAdmin from "./pages/admin/layout";
import UserPage from "./pages/admin/user";
import DashBoardPage from "./pages/admin/dashboard";
import LoginPage from "./pages/client/auth";
import ResultPage from "./pages/client/result";
import ProductPage from "./pages/admin/product";
import RoutePage from "./pages/client/route";



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
    path: "/result",
    element: <ResultPage />,
  },
  {
    path: "/route",
    element: <RoutePage />,
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
      },
      {
        path: "product",
        element: <ProductPage />
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
