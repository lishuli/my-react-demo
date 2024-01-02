import { put, call, takeLatest, take, fork } from "redux-saga/effects";
// 1，引入招聘信息接口获取函数inviteInfoService
import { loginService, inviteInfoService } from "../service/request";

// 登录功能saga
export function* login(action) {
  try {
    // 调用我们的登录接口，获取登录成功失败的信息
    const loginInfo = yield call(loginService, action.account);
    // 如果登录成功，更新store中的loginInfo
    yield put({ type: "loginSuccess", loginInfo });
  } catch (error) {
    // 登录失败 弹出登录失败的message
    alert(error.msg);
  }
}
// 登出功能saga，更新store中的loginInfo为{ success: false }
export function* loginOut() {
  yield put({
    type: "loginSuccess",
    loginInfo: { success: false, name: "", password: "" },
  });
}

// 2,获取招聘信息并输出至控制台的saga
export function* getInviteInfo() {
  // 2.1，获取招聘信息
  const inviteInfo = yield call(inviteInfoService);
  // 2.2，输出至控制台
  console.log("招人啦：", inviteInfo);
}

export function* watchLogin() {
  // 3，页面进入时执行getInviteInfo，以获取招聘信息并输出至控制台。
  yield fork(getInviteInfo);

  yield takeLatest("login", login);

  // 0，去掉之前使用takeLatest完成的对 类型为loginOut的action的监听
  // yield takeLatest("loginOut", loginOut);
  // 1，使用take等待类型loginOut的action的到来，take将阻塞当前Generator
  yield take("loginOut");
  // 2，take监听到类型loginOut的action，执行yield call(loginOut)，即继续登出操作
  yield call(loginOut);
}
