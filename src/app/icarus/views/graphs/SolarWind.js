import React from "react";
import utils from "icarus/utils";

export class SolarWind extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "SolarWind";
    this.state = {
      margin: {
        top: 0,
        right: 64,
        bottom: 36,
        left: 64
      }
    };
  }

  render() {
    const {width,height,data} = this.props;
    console.log(data);

    if (data.length === 0) {
      return null;
    }

    utils.time(data[0],"date","time");

    const maxX = utils.maxOf(data,"time");
    const minX = utils.minOf(data,"time");

    const maxDensityY = utils.maxOf(data,"density");
    const minDensityY = utils.minOf(data,"density");

    const maxTemperatureY = utils.maxOf(data,"temperature");
    const minTemperatureY = utils.minOf(data,"temperature");

    const density = utils.dots(utils.points(data[0],"time","density",minX,maxX,minDensityY,maxDensityY),width,height);
    const temperature = utils.dots(utils.points(data[0],"time","temperature",minX,maxX,minTemperatureY,maxTemperatureY),width,height);

    const {margin} = this.state;
    const viewBox = `0 0 ${width} ${height}`;
    const dataWidth = width - (margin.right + margin.left);
    const transform = `translate(${margin.left},${margin.top})`;
    return (
      <svg className="Graph__image" width="100%" height="100%" viewBox={viewBox}>
        <g data-width={dataWidth} transform={transform}>
          <g className="Graph__density">
            {density}
          </g>
          <g className="Graph__temperature">
            {temperature}
          </g>
          <g className="Graph__axis" transform={`translate(0,${height})`}>
            
          </g>
          <g className="Graph__axis" transform="translate(0,0)">
            <text className="Graph__text" transform="rotate(-90)" style={{textAnchor:"end"}}>
              Density (P/cm³)
            </text>
          </g>
          <g className="Graph__axis" transform={`translate(${width},0)`}>
            <text className="Graph__text" transform="rotate(90)" style={{textAnchor:"start"}}>
              Temperature (K)
            </text>
          </g>
          <line className="Graph__timeline" y1="0" y2={height} />
        </g>
      </svg>
    );
  }
}


export default SolarWind;
