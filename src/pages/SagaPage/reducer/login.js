// 保存登录之后的信息到store
function setLoginInfoReducer(state = {}, action = {}) {
  switch (action.type) {
    case "loginSuccess":
      return { ...state, ...action.loginInfo };
    default:
      return state;
  }
}

export default setLoginInfoReducer;
