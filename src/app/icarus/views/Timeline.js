import React from "react";
import utils from "icarus/utils";

export class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Timeline";
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
    this.timeoutID = null;
    this.state = { value: 0 };
  }

  updateValue(value) {
    this.setState({ value });
    if (this.props.onChange) {
      // TODO: Cuándo se llama a este método en realidad
      // se debería devolver una fecha entre start y end.
      this.props.onChange(value);
    }
  }

  updateValueFromEvent(e) {
    const {left, width} = this.refs.container.getBoundingClientRect();
    const value = Math.max(0, Math.min(1, (e.clientX - left) / width));
    this.updateValue(value);
  }

  handleMouseDown(e) {
    if (e.button === 0 && this.props.isRunning) {
      this.cancelTimeout();

      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("mousemove", this.handleMouseMove);
    }
  }

  handleMouseMove(e) {
    this.updateValueFromEvent(e);
  }

  handleMouseUp(e) {
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMouseMove);

    this.requestTimeout(5000);
  }

  handleClick(e) {
    this.cancelTimeout();
    this.updateValueFromEvent(e);
  }

  handleTimeout() {
    const value = this.state.value >= 1.0 ? 0.0 : this.state.value + 0.01;
    this.setState({ value });
    if (this.props.onChange) {
      // TODO: Cuándo se llama a este método en realidad
      // se debería devolver una fecha entre start y end.
      this.props.onChange(value);
    }
    this.requestTimeout();
  }

  cancelTimeout() {
    if (this.timeoutID !== null) {
      clearTimeout(this.timeoutID);
      this.timeoutID = null;
    }
  }

  requestTimeout(timeout = 96) {
    this.timeoutID = setTimeout(this.handleTimeout, timeout);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isRunning !== this.props.isRunning && nextProps.isRunning === true) {
      this.requestTimeout();
    } else if (nextProps.isRunning !== this.props.isRunning && nextProps.isRunning === false) {
      this.cancelTimeout();
      this.setState({
        value: 0
      });
    }
  }

  componentWillUnmount() {
    this.cancelTimeout();
  }

  render() {
    const start = this.props.startDate.getTime();
    const end = this.props.endDate.getTime();
    const current = (this.state.value * (end - start)) + start;

    const startDate = utils.formatDate(this.props.startDate);
    const currentDate = utils.formatDate(new Date(current));
    const endDate = utils.formatDate(this.props.endDate);

    return (
      <div className="Timeline">
        <div className="Timeline__progress" ref="container" onClick={this.handleClick}>
          <div className="Timeline__bar">
            <div style={{"transform": `scaleX(${this.state.value})`}} className="Timeline__fill"></div>
          </div>
          <div style={{"left": `${this.state.value * 100}%`}} className="Timeline__mark" onMouseDown={this.handleMouseDown}>
            <div className="Timeline__markTop"></div>
            <div className="Timeline__markBottom"></div>
          </div>
        </div>
        <div className="Timeline__dates">
          <div className="Timeline__dateStart">{startDate}</div>
          <div className="Timeline__dateCurrent">{currentDate}</div>
          <div className="Timeline__dateEnd">{endDate}</div>
        </div>
      </div>
    );
  }
}

Timeline.propTypes = {
  isRunning: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  startDate: React.PropTypes.instanceOf(Date).isRequired,
  endDate: React.PropTypes.instanceOf(Date).isRequired
};

export default Timeline;
