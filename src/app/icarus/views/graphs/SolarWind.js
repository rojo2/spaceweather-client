import React from "react";
import utils from "icarus/utils";
import Graph from "icarus/views/graphs/Graph";

class SolarWindGraphData extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.props.data
        || nextProps.width !== this.props.width
        || nextProps.height !== this.props.height;
  }

  render() {
    const {width,height,data} = this.props;

    utils.time(data[0],"date","time");

    const maxX = utils.maxOf(data,"time");
    const minX = utils.minOf(data,"time");

    const maxDensityY = utils.maxOf(data,"density");
    const minDensityY = utils.minOf(data,"density");

    const maxTemperatureY = utils.maxOf(data,"temperature");
    const minTemperatureY = utils.minOf(data,"temperature");

    const density = utils.dots(utils.points(data[0],"time","density",minX,maxX,minDensityY,maxDensityY),width,height);
    const temperature = utils.dots(utils.points(data[0],"time","temperature",minX,maxX,minTemperatureY,maxTemperatureY),width,height);

    const minTime = new Date(minX).getTime();
    const maxTime = new Date(maxX).getTime();
    const xAxis = utils.ticks(minTime,maxTime);
    const xTicks = xAxis.map((value,index,list) => {
      const x = utils.interpolate((value - minX) / (maxX - minX),0,width);
      const y = 24;
      const transform = `translate(${x},${y})`;
      return (
        <g className="tick" transform={transform} key={value}>
          <text x="0" y="0" style={{textAnchor:"middle"}}>{utils.formatDate(new Date(value))}</text>
        </g>
      );
    });

    const yTemperatureTicks = utils.ticks(minTemperatureY,maxTemperatureY).map((value,index,list) => {
      const x = 16;
      const y = utils.interpolate((value - minTemperatureY) / (maxTemperatureY - minTemperatureY),height,0);
      const transform = `translate(${x},${y})`;
      return (
        <g className="tick" transform={transform} key={value}>
          <text x="0" y="0" style={{textAnchor:"start"}}>{value.toExponential(1)}</text>
        </g>
      );
    });

    const yDensityTicks = utils.ticks(minDensityY,maxDensityY).map((value,index,list) => {
      const x = -16;
      const y = utils.interpolate((value - minDensityY) / (maxDensityY - minDensityY),height,0);
      const transform = `translate(${x},${y})`;
      const key = `${x}_${y}`;
      return (
        <g className="tick" transform={transform} key={key}>
          <text x="0" y="0" style={{textAnchor:"end"}}>{value.toExponential(1)}</text>
        </g>
      );
    });

    const xLines = xAxis.map((value,index,list) => {
      const x = utils.interpolate((value - minX) / (maxX - minX),0,width);
      const y = 0;
      const key = `x-line${x}_${y}`;
      return (
        <g className="tick" key={key}>
          <line x1={x} x2={x} y1={y} y2={height} />
        </g>
      );
    });

    return (
      <g>
        {xLines}
        <g className="Graph__density">
          {density}
        </g>
        <g className="Graph__temperature">
          {temperature}
        </g>
        <g className="Graph__axis" transform={`translate(0,${height})`}>
          {xTicks}
        </g>
        <g className="Graph__axis" transform="translate(0,0)">
          {yDensityTicks}
          <text className="Graph__text" transform="rotate(-90)" style={{textAnchor:"end"}}>
            Density (P/cm³)
          </text>
        </g>
        <g className="Graph__axis" transform={`translate(${width},0)`}>
          {yTemperatureTicks}
          <text className="Graph__text" transform="rotate(90)" style={{textAnchor:"start"}}>
            Temperature (K)
          </text>
        </g>
      </g>
    );
  }
}

export class SolarWind extends Graph {
  constructor(props) {
    super(props);
    this.displayName = "SolarWind";
  }

  render() {
    const {width,height,data} = this.props;
    if (data.length === 0) {
      return null;
    }
    const {margin} = this.state;
    const viewBox = `0 0 ${width} ${height}`;
    const dataWidth = width - (margin.right + margin.left);
    const transform = `translate(${margin.left},${margin.top})`;
    return (
      <svg className="Graph__image" width="100%" height="100%" viewBox={viewBox}>
        <g data-width={dataWidth} transform={transform}>
          <SolarWindGraphData data={data} width={this.mWidth} height={this.mHeight} />
          <line className="Graph__timeline" y1="0" y2={height} x1={this.props.value * this.mWidth} x2={this.props.value * this.mWidth}  />
        </g>
      </svg>
    );
  }
}


export default SolarWind;
