import React from "react";
import Loader from "icarus/views/Loader";

import API from "icarus/api";
import utils from "icarus/utils";

let total = 0;
let loaded = 0;
let errored = 0;

export class EIT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      index: 0,
      data: [],
      startX: 0,
      currentX: 0,
      isLoading: true,
      startDate: new Date(0),
      endDate: new Date(0)
    };

    this.displayName = "EIT";

    this.handleMouseDownRel = this.handleMouseDownRel.bind(this);
    this.handleMouseMoveRel = this.handleMouseMoveRel.bind(this);
    this.handleMouseUpRel = this.handleMouseUpRel.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.handleClick = this.handleClick.bind(this);

    this.handleTimeout = this.handleTimeout.bind(this);

    this.timeoutID = null;
  }

  updateValue(newValue) {
    const clampedNewValue = Math.max(0, Math.min(1, newValue));
    const filter = this.props.filter;
    if (this.state[filter] && this.state[filter].length > 0) {
      this.setState({
        value: clampedNewValue,
        index: Math.round(clampedNewValue * (this.state[filter].length - 1))
      });
    }
    if (this.props.onChange) {
      // TODO: Cuándo se llama a este método en realidad
      // se debería devolver una fecha entre start y end.
      this.props.onChange(clampedNewValue);
    }
  }

  updateValueFromEvent(e) {
    const {left,width} = this.refs.container.getBoundingClientRect();
    const newValue = (e.clientX - left) / width;
    this.updateValue(newValue);
  }

  handleMouseDownRel(e) {
    if (e.button === 0 && !this.state.isLoading) {
      this.cancelTimeout();
      document.addEventListener("mouseup", this.handleMouseUpRel);
      document.addEventListener("mousemove", this.handleMouseMoveRel);
      this.setState({ startX: e.clientX, currentX: e.clientX });
    }
  }

  handleMouseMoveRel(e) {
    const {width} = this.refs.sun.getBoundingClientRect();
    const newValue = this.state.value + ((e.clientX - this.state.currentX) / width);
    this.setState({
      startX: this.state.currentX,
      currentX: e.clientX
    });
    this.updateValue(newValue);
  }

  handleMouseUpRel(e) {
    if (e.button === 0) {
      document.removeEventListener("mouseup", this.handleMouseUpRel);
      document.removeEventListener("mousemove", this.handleMouseMoveRel);
      this.requestTimeout(5000);
    }
  }

  handleMouseDown(e) {
    if (e.button === 0 && !this.state.isLoading) {
      this.cancelTimeout();
      document.addEventListener("mouseup", this.handleMouseUp);
      document.addEventListener("mousemove", this.handleMouseMove);
    }
  }

  handleMouseMove(e) {
    this.updateValueFromEvent(e);
  }

  handleMouseUp(e) {
    if (e.button === 0) {
      document.removeEventListener("mouseup", this.handleMouseUp);
      document.removeEventListener("mousemove", this.handleMouseMove);
      this.requestTimeout(5000);
    }
  }

  handleClick(e) {
    this.cancelTimeout();
    this.updateValueFromEvent(e);
  }

  handleTimeout() {
    const value = this.state.value >= 1.0 ? 0.0 : this.state.value + 0.01;
    const filter = this.props.filter;
    this.setState({
      value: value,
      index: Math.round(value * (this.state[filter].length - 1))
    });
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
    if (this.timeoutID !== null) {
      this.cancelTimeout();
    }
    this.timeoutID = setTimeout(this.handleTimeout, timeout);
  }

  loadImages(filter) {
    if (this.state[filter]
     && this.state[filter].length > 0) {
      return Promise.resolve(this.state[filter]);
    }

    console.log("start loading");
    if (this.state.isLoading !== true) {
      this.setState({ isLoading: true });
    }
    loaded = errored = total = 0;
    const minDate = utils.daysFrom(-7);
    return API.getImageChannels({
      channeltype: filter,
      date_min: minDate
    }).then((res) => {
      const images = res.body;
      total = images.length;
      utils.time(images);
      const startDate = new Date(utils.min(images,"time"));
      const endDate = new Date(utils.max(images,"time"));
      this.setState({
        data: images,
        startDate,
        endDate
      });
      return Promise.all(images.map((image) => {
        return new Promise((resolve, reject) => {
          function handler(e) {
            if (e.type === "load") {
              loaded++;
              return resolve(e.target);
            }
            errored++;
            return reject(e);
          }
          const img = new Image();
          img.addEventListener("load",handler);
          img.addEventListener("error",handler);
          img.addEventListener("abort",handler);
          img.crossOrigin = "anonymous";
          img.src = image.image;
        });
      }));
    }).then((images) => {
      this.setState({
        [filter]: images,
        isLoading: false
      });
      return images;
    }).catch((err) => {
      console.error(err);
      console.trace(err.stack);
      this.setState({
        isLoading: false
      });
    });
  }

  componentWillMount() {
    this.loadImages(this.props.filter).then((images) => {
      console.log("images loaded");
    }).catch((err) => {
      console.log("images loaded (errors)");
    });
  }

  componentWillUnmount() {
    this.cancelTimeout();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.loadImages(nextProps.filter).then((images) => {
        console.log("images loaded");
      }).catch((err) => {
        console.log("images loaded (errors)");
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isLoading !== this.state.isLoading && nextState.isLoading === true) {
      this.cancelTimeout();
      this.setState({ value: 0, index: 0 });
    } else if (nextState.isLoading !== this.state.isLoading && nextState.isLoading === false) {
      this.requestTimeout();
    }
  }

  componentDidUpdate() {
    const filter = this.props.filter;
    if (this.state[filter]
     && this.state[filter].length > 0) {
      const {canvas,sun:container} = this.refs;
      const {width,height} = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      const filter = this.props.filter;
      const image = this.state[filter][this.state.index];
      if (image) {
        const size = Math.min(width,height);
        context.save();
        context.translate(canvas.width * 0.5,canvas.height * 0.5);
        context.drawImage(image,-size * 0.5,-size * 0.5,size,size);
        context.restore();
      }
    }
  }

  render() {
    const start = this.state.startDate.getTime();
    const end = this.state.endDate.getTime();
    const current = (this.state.value * (end - start)) + start;

    const startDate = utils.formatDate(this.state.startDate);
    const currentDate = utils.formatDate(new Date(current));
    const endDate = utils.formatDate(this.state.endDate);

    return (
      <div className="EIT">
        <div className="Panel__content">
          <Loader isLoading={this.state.isLoading} />
          <div className="Sun" ref="sun">
            <div className="Sun__container" onMouseDown={this.handleMouseDownRel}>
              <canvas ref="canvas" className="Sun__image">

              </canvas>
            </div>
          </div>
        </div>
        <div className="Panel__footer">
          <div className="Timeline">
            <div className="Timeline__progress" ref="container" onClick={this.handleClick}>
              <div className="Timeline__bar">
                <div style={{"transform": `scaleX(${this.state.value})`}} className="Timeline__fill">

                </div>
              </div>
              <div style={{"left": `${this.state.value * 100}%`}} className="Timeline__mark" onMouseDown={this.handleMouseDown}>
                <div className="Timeline__markTop">

                </div>
                <div className="Timeline__markBottom">

                </div>
              </div>
            </div>
            <div className="Timeline__dates">
              <div className="Timeline__dateStart">{startDate}</div>
              <div className="Timeline__dateCurrent">{currentDate}</div>
              <div className="Timeline__dateEnd">{endDate}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EIT;
