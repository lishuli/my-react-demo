import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CanvasImg from "../pages/CanvasImg/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/canvasImg",
    element: <CanvasImg />,
  },
]);

export default router;
