import React from "react";
import Timeline from "icarus/views/Timeline";
import Loader from "icarus/views/Loader";

import API from "icarus/api";
import utils from "icarus/utils";

let total = 0;
let loaded = 0;
let errored = 0;

export class WeatherEIT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      data: [],
      images: [],
      isLoading: true,
      startDate: new Date(0),
      endDate: new Date(0)
    };
    this.handleTimelineChange = this.handleTimelineChange.bind(this);
  }

  handleTimelineChange(value) {
    this.setState({
      index: Math.round(value * (this.state.images.length - 1))
    });
    this.props.onChange(value);
  }

  loadImages(filter) {
    console.log("start loading");
    if (this.state.isLoading !== true) {
      this.setState({
        isLoading: true
      });
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
        images,
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

  componentWillReceiveProps(nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.loadImages(nextProps.filter).then((images) => {
        console.log("images loaded");
      }).catch((err) => {
        console.log("images loaded (errors)");
      });
    }
  }

  componentDidUpdate() {
    if (this.state.images.length > 0) {
      const {canvas,container} = this.refs;
      const {width,height} = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      const image = this.state.images[this.state.index];
      if (image) {
        context.drawImage(image,0,0,width,height);
      }
    }
  }

  render() {
    return (
      <div className="EIT">
        <div className="Panel__content">
          <Loader isLoading={this.state.isLoading} />
          <div className="Sun" ref="container">
            <div className="Sun__container">
              <canvas ref="canvas" className="Sun__image"></canvas>
            </div>
          </div>
        </div>
        <div className="Panel__footer">
          <Timeline onChange={this.handleTimelineChange}
                    isRunning={!this.state.isLoading}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate} />
        </div>
      </div>
    );
  }
}

export default WeatherEIT;
