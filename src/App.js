import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <ul className="nav-ul">
        <li className="nav-li">
          <Link to="/canvasImg">CanvasImg</Link>
          <Link to="/useReducerPage">UseReducerPage</Link>
        </li>
      </ul>
    </div>
  );
}

export default App;
