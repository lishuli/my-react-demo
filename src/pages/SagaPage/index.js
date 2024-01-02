// redux-saga----参考https://juejin.cn/post/6975041237266989086
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

// 自定义模块引入
// 1，redux中的 reducer引入
import rootReducer from "./reducer";
// 2，react中 Counter组件引入
import Counter from "./component";
import Login from "./component/login";
// 3， redux-saga中间件的 saga文件引入
import rootSaga from "./saga";

// 4，创建一个redux-saga中间件
const sagaMiddleware = createSagaMiddleware();
// 5，将redux-saga中间件加入到redux中
// const store = createStore(rootReducer, {});
const store = createStore(rootReducer, {}, applyMiddleware(sagaMiddleware));
// 6，动态的运行saga，注意 sagaMiddleware.run(rootSaga) 只能在applyMiddleware(sagaMiddleware)之后进行
sagaMiddleware.run(rootSaga);

function SagaPage() {
  return (
    <Provider store={store}>
      <Counter />
      <Login />
    </Provider>
  );
}

export default SagaPage;
