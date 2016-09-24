import React from "react";
import {Link} from "react-router";
import API from "icarus/api";
import Loader from "icarus/views/Loader";
import Timeline from "icarus/views/Timeline";

export class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Weather";
    this.state = {
      data: [],
      images: [],
      index: 0,
      startDate: new Date(0),
      endDate: new Date(0)
    };
    this.handleTimelineChange = this.handleTimelineChange.bind(this);
  }

  loadImages(filter) {
    const minDate = "2016-09-17";
    API.getImageChannels({
      channeltype: filter,
      date_min: minDate
    }).then((res) => {
      const images = res.body;
      let startDate = Number.MAX_VALUE;
      let endDate = Number.MIN_VALUE;
      images.forEach((image) => {
        image.date = new Date(image.date);
        startDate = Math.min(image.date.getTime(), startDate);
        endDate = Math.max(image.date.getTime(), endDate);
      });
      this.setState({
        data: res.body,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });
      return Promise.all(res.body.map((image) => {
        return new Promise((resolve, reject) => {
          function handler(e) {
            if (e.type === "load") {
              return resolve(e.target);
            }
            return reject(e);
          }
          const img = new Image();
          img.addEventListener("load", handler);
          img.addEventListener("error", handler);
          img.addEventListener("abort", handler);
          img.crossOrigin = "anonymous";
          img.src = image.image;
        });
      }));
    }).then((images) => {
      //console.log(images);
      this.setState({ images });
    });
  }

  componentWillMount() {
    this.loadImages(this.props.location.query.filter);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.filter !== nextProps.location.query.filter) {
      this.loadImages(nextProps.location.query.filter);
    }
  }

  componentDidUpdate() {
    if (this.state.images.length > 0) {
      const {canvas,container} = this.refs;
      const {width,height} = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(this.state.images[this.state.index],0,0,width,height);
    }
  }

  handleTimelineChange(value) {
    this.setState({
      index: Math.round(value * (this.state.images.length - 1))
    });
  }

  render() {
    const flux = this.props.location.query.flux;
    const filter = this.props.location.query.filter;
    return (
      <section className="Weather isActive">
        <div className="Weather__EITFilters">
          <div className="Panel__header">
            <div className="Panel__title">EIT Filters</div>
            <div className="Panel__menu">
              <Link to={{ pathname: "/weather", query: { "filter": 1, "flux": flux }}} activeClassName="isActive" className="Panel__menuItem">
                <div className="Value">171</div>
                <div className="Unit">Å</div>
              </Link>
              <Link to={{ pathname: "/weather", query: { "filter": 2, "flux": flux }}} activeClassName="isActive" className="Panel__menuItem">
                <div className="Value">193</div>
                <div className="Unit">Å</div>
              </Link>
              <Link to={{ pathname: "/weather", query: { "filter": 3, "flux": flux }}} activeClassName="isActive" className="Panel__menuItem">
                <div className="Value">211</div>
                <div className="Unit">Å</div>
              </Link>
              <Link to={{ pathname: "/weather", query: { "filter": 4, "flux": flux }}} activeClassName="isActive" className="Panel__menuItem">
                <div className="Value">304</div>
                <div className="Unit">Å</div>
              </Link>
              <Link to={{ pathname: "/weather", query: { "filter": 5, "flux": flux }}} activeClassName="isActive" className="Panel__menuItem">
                <div className="Value">HMI</div>
              </Link>
            </div>
          </div>
          <div className="Panel__content">
            <Loader />
            <div className="Sun" ref="container">
              <div className="Sun__container">
                <canvas ref="canvas" className="Sun__image"></canvas>
              </div>
            </div>
          </div>
          <div className="Panel__footer">
            <Timeline onChange={this.handleTimelineChange}
                      startDate={this.state.startDate}
                      endDate={this.state.endDate} />
          </div>
        </div>
        <div className="Weather__fluxes">
          <div className="Panel__header">
            <div className="Panel__title">Fluxes</div>
            <div className="Panel__menu">
              <Link to={{ pathname: "/weather", query: { "filter": filter, "flux": "solar-wind" }}} activeClassName="isActive" className="Panel__menuItem">Solar Wind</Link>
              <Link to={{ pathname: "/weather", query: { "filter": filter, "flux": "particle" }}} activeClassName="isActive" className="Panel__menuItem">Particle Flux</Link>
              <Link to={{ pathname: "/weather", query: { "filter": filter, "flux": "electron" }}} activeClassName="isActive" className="Panel__menuItem">Electron Flux</Link>
              <Link to={{ pathname: "/weather", query: { "filter": filter, "flux": "x-ray" }}} activeClassName="isActive" className="Panel__menuItem">X-Ray Flux</Link>
            </div>
          </div>
          <div className="Panel__content">
            <Loader />
            <div className="Graph">
              <div className="Graph__content"></div>
              <div className="Graph__legends">
                <a href="#" className="Graph__legend">
                  <div className="Graph__legendColor--particle10"></div>
                  <div className="Graph__legendLabel">P>10MeV</div>
                </a>
                <a href="#" className="Graph__legend">
                  <div className="Graph__legendColor--particle100"></div>
                  <div className="Graph__legendLabel">P>100MeV</div>
                </a>
              </div>
            </div>
          </div>
          <div className="Panel__footer"></div>
        </div>
      </section>
    );
  }
}

export default Weather;
