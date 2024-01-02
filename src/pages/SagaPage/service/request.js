export function loginService({ name, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name === "admin" && password === "admin") {
        resolve({ success: true, name, password });
      } else {
        reject({ success: false, msg: "账户不合法" });
      }
    }, 1000);
  });
}

// 模拟接口获取招聘信息，调用该接口5s后返回招聘信息内容
export function inviteInfoService() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("我们需要100名前端优秀开发工程师，有意请联系微信：Tsuki_");
    }, 2000);
  });
}
