import React from "react";
import Loader from "icarus/views/Loader";
import API from "icarus/api";
import utils from "icarus/utils";

function sunspotCoord(value, positive = false) {
  return Math.sin(Math.PI * (positive ? 0.5 : -0.5)) * Math.sin(value);
}

function parseSunspot(data) {
  const NS = (data.substr(0,1) === "N" ? false : true);
  const WE = (data.substr(3,1) === "W" ? true : false);

  const alpha = (parseInt(data.substr(1,2),10) / 90) * Math.PI * 0.5;
  const beta = (parseInt(data.substr(4,2),10) / 90) * Math.PI * 0.5;

  const x = sunspotCoord(beta, WE);
  const y = sunspotCoord(alpha, NS);

  return { x, y };
}

export class Sunspots extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Sunspots";
    this.state = {
      isLoading: true,
      sunspots: [],
      images: [],
      image: null,
      radius: 0,
      width: 0,
      height: 0,
      halfWidth: 0,
      halfHeight: 0
    };
  }

  loadSunspots() {
    const minDateFormatted = utils.daysFrom(-1);
    const maxDateFormatted = utils.daysFrom(1);
    const minDateFormattedImage = utils.daysFrom(-1);
    const maxDateFormattedImage = utils.daysFrom(1);
    return Promise.all([
      API.getImageChannels({
        channeltype: 5,
        date_min: minDateFormattedImage,
        date_max: maxDateFormattedImage
      }),
      API.getSunspotRegions({
        date_min: minDateFormatted,
        date_max: maxDateFormatted
      })
    ]).then((res) => {
      const images = res[0].body;
      const sunspots = res[1].body;
      this.setState({ sunspots, images });
    });
  }

  componentDidMount() {
    this.loadSunspots().then(() => {
      this.setState({ isLoading: false });
    });

    const container = this.refs.container;
    const {width,height} = container.getBoundingClientRect();
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const radius = Math.min(halfWidth,halfHeight) - 55;
    this.setState({
      radius,
      width,
      height,
      halfWidth,
      halfHeight
    });
  }

  renderImageNotFound() {
    const {width,height,halfWidth,halfHeight} = this.state;
    return [
      <circle className="Image--notFound" cx={halfWidth} cy={halfHeight} key="Image--notFound--circle" />,
      <line className="Image--notFound" x1="0" y1="0" x2={width} y2={height} key="Image--notFound--x1" />,
      <line className="Image--notFound" x1="0" y1={height} x2={width} y2="0" key="Image--notFound--x2" />
    ];
  }

  renderImage() {
    const [image] = this.state.images;
    const {width,height} = this.state;
    return (
      <image width={width} height={height} xlinkHref={image.image} />
    );
  }

  renderSunspotsImage() {
    if (this.state.images && this.state.images.length > 0) {
      return this.renderImage();
    }
    return this.renderImageNotFound();
  }

  renderSunspot(sunspot) {
    const {halfWidth,halfHeight,radius} = this.state;
    const position = parseSunspot(sunspot.location);
    const x = halfWidth + (position.x * radius);
    const y = halfHeight + (position.y * radius);
    const transform = `translate(${x},${y})`;
    return (
      <g className="Graph__sunspotInfo" transform={transform} key={sunspot.location}>
        <circle className="Graph__sunspot" cx="0" cy="0" r="10" />
        <text className="Graph__sunspotText">
          <tspan className="Graph__sunspotInfoLabel" x="0" y="0">Spot class: </tspan>
          <tspan className="Graph__sunspotInfoValue" x="132" y="0">{sunspot.spotclass}</tspan>
          <tspan className="Graph__sunspotInfoLabel" x="0" y="20">Magnetic class: </tspan>
          <tspan className="Graph__sunspotInfoValue" x="132" y="20">{sunspot.magneticclass}</tspan>
          <tspan className="Graph__sunspotInfoLabel" x="0" y="40">Location: </tspan>
          <tspan className="Graph__sunspotInfoValue" x="132" y="40">{sunspot.location}</tspan>
          <tspan className="Graph__sunspotInfoLabel" x="0" y="60">Size: </tspan>
          <tspan className="Graph__sunspotInfoValue" x="132" y="60">{sunspot.size}</tspan>
          <tspan className="Graph__sunspotInfoLabel" x="0" y="80">No. of sunspots: </tspan>
          <tspan className="Graph__sunspotInfoValue" x="132" y="80">{sunspot.numberofsunspots}</tspan>
        </text>
      </g>
    );
  }

  renderSunspots(sunspots = this.state.sunspots) {
    return sunspots.map((sunspot) => this.renderSunspot(sunspot));
  }

  renderGraph() {
    const {width,height,radius,halfWidth,halfHeight} = this.state;
    const viewBox = `0 0 ${width} ${height}`;
    return (
      <svg className="Graph__image" width="100%" height="100%" viewBox={viewBox}>
        <g>
          {this.renderSunspotsImage()}
          <circle className="Graph__sun" cx={halfWidth} cy={halfHeight} r={radius} />
          {this.renderSunspots()}
        </g>
      </svg>
    );
  }

  render() {
    return (
      <section className="Sunspots isActive">
        <div className="Sunspots__image">
          <div className="Panel__header">
            <div className="Panel__title">Sunspots</div>
          </div>
          <div className="Panel__content">
            <Loader isLoading={this.state.isLoading} />
            <div className="Graph">
              <div className="Graph__content" ref="container">
                {this.renderGraph()}
              </div>
            </div>
          </div>
          <div className="Panel__footer"></div>
        </div>
        <div className="Sunspots__description">
          <div className="Panel__content--text">
            <div className="ScrolledContent">
              <div className="Text__header">Sunspots</div>
              <div className="Text__body">
                <p>Sunspots are temporary phenomena on the photosphere of the Sun that appear visibly as dark spots compared to surrounding regions. They correspond to concentrations of magnetic field flux that inhibit convection and result in reduced surface temperature compared to the surrounding photosphere. Sunspots usually appear in pairs, with pair members of opposite magnetic polarity. The number of sunspots varies according to the approximately 11-year solar cycle.</p>
                <p>Individual sunspots may endure anywhere from a few days to a few months, but eventually decay. Sunspots expand and contract as they move across the surface of the Sun with a size ranging from 16 kilometers to 160,000 kilometers in diameter. The larger variety are visible from Earth without the aid of a telescope. They may travel at relative speeds ("proper motions") of a few hundred meters per second when they first emerge.</p>
                <p>Reflecting intense magnetic activity, sunspots accompany secondary phenomena such as coronal loops (prominences) and reconnection events. Most solar flares and coronal mass ejections originate in magnetically active regions around visible sunspot groupings. Similar phenomena indirectly observed on stars other than the sun are commonly called starspots and both light and dark spots have been measured.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Sunspots;
