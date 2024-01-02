import { combineReducers } from "redux";
import setLoginInfoReducer from "./login";

function counterReducer(state = 1, action = {}) {
  switch (action.type) {
    case "increment":
      return state + 1;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  counter: counterReducer,
  loginInfo: setLoginInfoReducer,
});

export default rootReducer;
