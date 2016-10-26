import React from "react";
import utils from "icarus/utils";
import Graph from "icarus/views/graphs/Graph";

export class ProtonFlux extends Graph {
  constructor(props) {
    super(props);
    this.displayName = "ProtonFlux";
  }

  render() {
    const {width,height,data} = this.props;

    if (data.length === 0) {
      return null;
    }

    utils.time(data[0],"date","time");
    utils.time(data[1],"date","time");

    const maxX = utils.maxOf(data,"time",2);
    const minX = utils.minOf(data,"time",2);

    const minY = 0.01;
    const maxY = 120;

    const d0 = utils.path(utils.pointsLog(data[0],"time","value",minX,maxX,minY,maxY),this.mWidth,this.mHeight);
    const d1 = utils.path(utils.pointsLog(data[1],"time","value",minX,maxX,minY,maxY),this.mWidth,this.mHeight);
    const a0 = utils.areaPath(utils.pointsLog(data[0],"time","value",minX,maxX,minY,maxY),this.mWidth,this.mHeight);
    const a1 = utils.areaPath(utils.pointsLog(data[1],"time","value",minX,maxX,minY,maxY),this.mWidth,this.mHeight);

    const minTime = new Date(minX).getTime();
    const maxTime = new Date(maxX).getTime();
    const xAxis = utils.ticks(minTime,maxTime);
    const yAxis = utils.ticks(minY,maxY);
    const xTicks = utils.ticks(minTime,maxTime).map((value,index,list) => {
      const x = utils.interpolate(index / list.length,0,this.mWidth);
      const y = 24;
      const transform = `translate(${x},${y})`;
      return (
        <g className="tick" transform={transform} key={value}>
          <text x="0" y="0" style={{textAnchor:"center"}}>{utils.formatDate(new Date(value))}</text>
        </g>
      );
    });

    const yTicks = utils.ticks(minY,maxY).map((value,index,list) => {
      const x = -16;
      const y = utils.interpolate(index / list.length,this.mHeight,0);
      const transform = `translate(${x},${y})`;
      const key = `${x}_${y}`;
      return (
        <g className="tick" transform={transform} key={key}>
          <text x="0" y="0" style={{textAnchor:"end"}}>{value.toExponential(0)}</text>
        </g>
      );
    });

    const xLines = xAxis.map((value,index,list) => {
      const x = utils.interpolate(index / list.length,0,this.mWidth);
      const y = 0;
      const key = `x-line${x}_${y}`;
      return (
        <g className="tick" key={key}>
          <line x1={x} x2={x} y1={y} y2={this.mHeight} />
        </g>
      );
    });

    const yLines = yAxis.map((value,index,list) => {
      const x = 0;
      const y = utils.interpolate(index / list.length,0,this.mHeight);
      const key = `y-line${x}_${y}`;
      return (
        <g className="tick" key={key}>
          <line x1={x} x2={this.mWidth} y1={y} y2={y} />
        </g>
      );
    });

    const {margin} = this.state;
    const viewBox = `0 0 ${width} ${height}`;
    const dataWidth = width - (margin.right + margin.left);
    const transform = `translate(${margin.left},${margin.top})`;
    return (
      <svg className="Graph__image" width="100%" height="100%" viewBox={viewBox}>
        <g data-width={dataWidth} transform={transform}>
          {xLines}
          {yLines}
          <path className="Graph__area Graph__color0" d={a0} />
          <path className="Graph__line Graph__color0" d={d0} />
          <path className="Graph__area Graph__color1" d={a1} />
          <path className="Graph__line Graph__color1" d={d1} />
          <g className="Graph__axis" transform={`translate(0,${this.mHeight})`}>
            {xTicks}
          </g>
          <g className="Graph__axis" transform="translate(0,0)">
            {yTicks}
            <text className="Graph__text" transform="rotate(-90)" style={{textAnchor:"end"}}>
              Protons/cm²-s-sr
            </text>
          </g>
          <line className="Graph__timeline" y1="0" y2={height} x1={this.props.value * this.mWidth} x2={this.props.value * this.mWidth} />
        </g>
      </svg>
    );
  }
}


export default ProtonFlux;
