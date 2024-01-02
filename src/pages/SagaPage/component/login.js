import React from "react";
import { connect } from "react-redux";

class Home extends React.Component {
  // 1，维护可控input的用户名与密码
  state = { name: "admin", password: "admin" };
  // 2，用户名输入更新state中用户名
  nameChange = (e) => this.setState({ name: e.target.value });
  // 3，密码输入更新state中密码
  passwordChange = (e) => this.setState({ password: e.target.value });
  // 4，登出，将派发一个类型为loginOut的action
  loginOut = () => {
    this.props.dispatch({ type: "loginOut" });
  };
  // 5，登录，将派发一个类型为login的action，同时传入参数 用户名与密码
  login = () =>
    this.props.dispatch({
      type: "login",
      account: {
        name: this.state.name,
        password: this.state.password,
      },
    });

  render() {
    return (
      <div>
        {/* 可控用户名input */}
        <div>
          用户名：
          <input onChange={this.nameChange} value={this.state.name} />
        </div>
        {/* 可控密码input */}
        <div>
          密码：
          <input onChange={this.passwordChange} value={this.state.password} />
        </div>
        {/* 登录按钮 */}
        <button onClick={this.login}>登录</button>
        {/* 登出按钮 */}
        <button
          disabled={!this.props.loginInfo.success}
          onClick={this.loginOut}
        >
          登出
        </button>
        {/* 如果登录成功，将更新redux中的loginInfo.success为true，此时就会显示 xxx 用户登录成功 */}
        {/* 如果登录失败/未登录，将不显示这段文字 */}
        {this.props.loginInfo.success ? (
          <div>{this.props.loginInfo.name} 用户登录成功 </div>
        ) : null}
      </div>
    );
  }
}

// 6，使用connect将组件连接redux的store，并将获取store中登录信息数据加入到this.props中
const mapStateToProps = (state) => ({ loginInfo: state.loginInfo });
export default connect(mapStateToProps)(Home);
