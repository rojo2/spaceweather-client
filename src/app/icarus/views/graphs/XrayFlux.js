import React from "react";
import utils from "icarus/utils";

export class XrayFlux extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "XrayFlux";
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
    utils.time(data[1],"date","time");

    const maxX = utils.maxOf(data,"time",2);
    const minX = utils.minOf(data,"time",2);

    const minY = 0.000000001;
    const maxY = 0.00006;

    const d0 = utils.path(utils.pointsLog(data[0],"time","value",minX,maxX,minY,maxY),width,height);
    const d1 = utils.path(utils.pointsLog(data[1],"time","value",minX,maxX,minY,maxY),width,height);

    const {margin} = this.state;
    const viewBox = `0 0 ${width} ${height}`;
    const dataWidth = width - (margin.right + margin.left);
    const transform = `translate(${margin.left},${margin.top})`;
    return (
      <svg className="Graph__image" width="100%" height="100%" viewBox={viewBox}>
        <g data-width={dataWidth} transform={transform}>
          <path className="Graph__area Graph__color0" d={d0} />
          <path className="Graph__line Graph__color0" d={d0} />
          <path className="Graph__area Graph__color1" d={d1} />
          <path className="Graph__line Graph__color1" d={d1} />
          <g className="Graph__axis" transform={`translate(0,${height})`}>

          </g>
          <g className="Graph__axis" transform="translate(0,0)">
            <text className="Graph__text" transform="rotate(-90)" style={{textAnchor:"end"}}>
              Watts/m²
            </text>
          </g>
          <line className="Graph__timeline" y1="0" y2={height} />
        </g>
      </svg>
    );
  }
}


export default XrayFlux;
