import { useReducer, useEffect } from "react";

// useState实际是useReducer简单数据情景下的语法糖
function useCustomState(initialState) {
  // 特殊的 reducer
  const reducer = (state, action) => {
    if (typeof action === "function") {
      return action(state);
    }
    return action;
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = (action) => {
    dispatch(action);
  };

  return [state, setState];
}

// 使用 useCustomState
function UseReducerPage() {
  const [count, setCount] = useCustomState(0);

  useEffect(() => {
    console.log("count");
  }, [count]);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>add</button>
      <span>{count}</span>
    </>
  );
}

export default UseReducerPage;
