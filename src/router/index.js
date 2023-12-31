import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CanvasImg from "../pages/CanvasImg/index";
import UseReducerPage from "../pages/UseReducerPage/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/canvasImg",
    element: <CanvasImg />,
  },
  {
    path: "/useReducerPage",
    element: <UseReducerPage />,
  },
]);

export default router;
