import { all, put, takeEvery, delay, takeLatest } from "redux-saga/effects";
import { watchLogin } from "./login";

function* increment() {
  // 相当于：dispatch({ type: 'increment' })
  yield put({ type: "increment" });
}

function* incrementAsync() {
  // 延迟1s
  yield delay(1000);
  // 1s后，dispatch({ type: 'increment' })
  yield put({ type: "increment" });
}

function* watchIncrement() {
  // 监听类型为increment_saga的action，监听到启动increment
  yield takeEvery("increment_saga", increment);

  // 监听类型为incrementAsync_saga的action，监听到启动incrementAsync
  // yield takeEvery("incrementAsync_saga", incrementAsync);
  yield takeLatest("incrementAsync_saga", incrementAsync);
}

function* rootSaga() {
  // // 启动delay(3000, 'Love U')任务，因为delay是阻塞任务，所以delayRes将在3s后才能接收到返回的'Love U'值
  // const delayRes = yield all([delay(3000, "Love U")]);
  // // 3s后输出['Love U']
  // console.log("delayRes", delayRes);
  // ---------------------------------------------
  // 启动watchIncrement
  yield all([watchIncrement(), watchLogin()]);
  // ------------------------------------
  // // 并行启动delay任务与监听任务watchPrintSagaParams
  // // delay任务将在3s后完成，输出'Love U'
  // // watchPrintSagaParams中takeLatest一直处于监听状态，所以watchPrintSagaParams迟迟不会完成
  // // 所以在这里我们等不到res的结果输出
  // const res = yield all([delay(1000, "Love U"), watchIncrement()]);
  // // 等不到输出结果
  // console.log("res", res);
}

export default rootSaga;

// takeEvery -------------监听每一次对应action的派发
// takeLatest ------------监听最后一次action的派发，并自动取消之前已经在启动且仍在执行的任务，类似防抖
// put(action) -----------创建一个effect，命令中间件向store发起该action，非阻塞的，相当于直接dispatch(action)
// delay(timeout,[val]?)--产生一个阻塞的effect，阻塞timeout毫秒，并返回val的值。
// all([...effects])------命令中间件并行的运行多个effects，类似promise.all的行为。
// call ------------------阻塞调用
// fork ------------------非阻塞的调用
