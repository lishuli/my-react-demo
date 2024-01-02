import React from "react";
import { connect } from "react-redux";

class Counter extends React.Component {
  // 派发一个type为 increment_saga 的action
  add = () => this.props.dispatch({ type: "increment_saga" });
  // addAsync函数将派发一个类型为incrementAsync_saga的action
  addAsync = () => this.props.dispatch({ type: "incrementAsync_saga" });

  render() {
    return (
      <div>
        <span>{this.props.counter}</span>
        <button onClick={this.add}>add1-sync</button>
        <button onClick={this.addAsync}>add1-async</button>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({ counter: state.counter });
export default connect(mapStateToProps)(Counter);
