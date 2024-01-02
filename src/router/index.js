import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CanvasImg from "../pages/CanvasImg/index";
import UseReducerPage from "../pages/UseReducerPage/index";
import SagaPage from "../pages/SagaPage/index";

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
  {
    path: "/sagaPage",
    element: <SagaPage />,
  },
]);

export default router;
