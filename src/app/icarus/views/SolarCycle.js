import React from "react";
import Loader from "icarus/views/Loader";
import API from "icarus/api";
import utils from "icarus/utils";

export class SolarCycle extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "SolarCycle";
    this.state = {
      isLoading: true,
      width: 0,
      height: 0,
      sWidth: 0,
      sHeight: 0,
      mWidth: 0,
      mHeight: 0,
      margin: {
        top: 0,
        right: 0,
        bottom: 24,
        left: 0
      },
      smoothed: [],
      observed: [],
      predicted: []
    };
  }

  loadSolarCycle() {
    Promise.all([
      API.getSunspots({ sunspottype: 1 }),
      API.getSunspots({ sunspottype: 2 }),
      API.getSunspots({ sunspottype: 3 })
    ]).then((res) => {
      this.setState({
        isLoading: false,
        smoothed: res[0].body,
        predicted: res[1].body,
        observed: res[2].body
      });
    });
  }

  componentDidMount() {
    this.loadSolarCycle();
    const {container} = this.refs;
    const {width,height} = container.getBoundingClientRect();
    const {left:marginLeft,top:marginTop,bottom:marginBottom,right:marginRight} = this.state.margin;
    this.setState({
      width,
      height,
      mWidth: width - (marginLeft + marginRight),
      mHeight: height - (marginTop + marginBottom),
      sWidth: width + marginLeft,
      sHeight: height + marginTop
    });
  }

  renderGraph() {
    const {left:marginLeft,top:marginTop,bottom:marginBottom,right:marginRight} = this.state.margin;
    const {width,height,mWidth,mHeight,sWidth,sHeight,smoothed,predicted,observed} = this.state;

    const viewBox = `0 0 ${width} ${height}`;
    const transform = `translate(${marginLeft},${marginTop})`;
    const xTransform = `translate(0,${mHeight})`;
    const yStyle = { "textAnchor": "end" };

    utils.time(smoothed,"date","time");
    utils.time(predicted,"date","time");
    utils.time(observed,"date","time");

    const maxX = utils.maxOf([smoothed,predicted,observed],"time");
    const minX = utils.minOf([smoothed,predicted,observed],"time");

    const maxY = utils.maxOf([smoothed,predicted,observed],"value");
    const minY = utils.minOf([smoothed,predicted,observed],"value");

    const xTicks = utils.ticks(new Date(minX).getFullYear(),new Date(maxX).getFullYear()).map((value,index,list) => {
      const x = utils.interpolate(index / list.length,0,mWidth);
      const y = 24;
      const transform = `translate(${x},${y})`;
      return (
        <g className="tick" transform={transform} key={value}>
          <text x="0" y="0" style={{textAnchor:"center"}}>{value}</text>
        </g>
      );
    });

    const yTicks = utils.ticks(minY,maxY).map((value,index,list) => {
      const x = -16;
      const y = utils.interpolate(index / list.length,mHeight,0);
      const transform = `translate(${x},${y})`;
      return (
        <g className="tick" transform={transform} key={value}>
          <text x="0" y="0" style={{textAnchor:"end"}}>{value}</text>
        </g>
      );
    });

    return (
      <svg className="Graph__image" width="100%" height="100%" viewBox={viewBox}>
        <g transform={transform}>
          <path className="Graph__line Graph__smoothed" d={utils.path(utils.points(smoothed,"time","value",minX,maxX,minY,maxY),mWidth,mHeight)} />
          <path className="Graph__line Graph__predicted" d={utils.path(utils.points(predicted,"time","value",minX,maxX,minY,maxY),mWidth,mHeight)} />
          <path className="Graph__line Graph__observed" d={utils.path(utils.points(observed,"time","value",minX,maxX,minY,maxY),mWidth,mHeight)} />
          <g className="Graph__axis" transform={xTransform}>
            {xTicks}
          </g>
          <g className="Graph__axis">
            {yTicks}
            <text className="Graph__text" transform="rotate(-90)" style={yStyle}>
              MeV
            </text>
          </g>
        </g>
      </svg>
    );
  }

  render() {
    return (
      <section className="SolarCycle isActive">
        <div className="SolarCycle__graph">
          <div className="Panel__header">
            <div className="Panel__title">Solar Cycle</div>
          </div>
          <div className="Panel__content">
            <Loader isLoading={this.state.isLoading} />
            <div className="Graph">
              <div className="Graph__content" ref="container">
                {this.renderGraph()}
              </div>
              <div className="Graph__legends">
                <a href="#" className="Graph__legend">
                  <div className="Graph__legendColor--monthly"></div>
                  <div className="Graph__legendLabel">Monthly Values</div>
                </a>
                <a href="#" className="Graph__legend">
                  <div className="Graph__legendColor--smoothedMonthly"></div>
                  <div className="Graph__legendLabel">Smoothed Monthly Values</div>
                </a>
                <a href="#" className="Graph__legend">
                  <div className="Graph__legendColor--predictedMonthly"></div>
                  <div className="Graph__legendLabel">Predicted Monthly Values</div>
                </a>
              </div>
            </div>
          </div>
          <div className="Panel__footer">

          </div>
        </div>
        <div className="SolarCycle__description">
          <div className="Panel__content--text">
            <div className="ScrolledContent">
              <div className="Text__header">The Solar Cycle</div>
              <div className="Text__body">
                <p>The 11-year sunspot or solar cycle is a rhythmic waxing and waning of the number of dark sunspots on the visible disk of the Sun. It comes from the "winding-up" of the solar magnetic field during which the magnetic field gradually decays and then finally undergoes a total magnetic reversal, which is when the magnetic poles flip. As the magnetic field becomes gradually more entwined towards solar maximum the surface fields of the Sun becomes more and more wrapped up. This increases the activity on the surface of the Sun, seen as sunspots (regions of highly complex and intense magnetic fields) and the more frequent occurrence of solar flares and coronal mass ejections.</p>
                <p>The Sun is brighter at EUV and X-ray wavelengths during solar maximum then at solar minimum. This global brightening has Space Weather consequences. Impulsive events, such as coronal mass ejections, solar flares, or high speed streams in the solar wind, occur on timescales of minutes to hours, or even days. Delayed sources of space weather, such as geomagnetic storms, start after the solar signal that triggers the storm has passed the Earth and can last for days to weeks. Galactic cosmic rays are reduced by solar activity and have more rapid variations caused by CMEs. Interplanetary dust particles are a continuous source of easily-ionized meteoric material to the Earth. Impacts of asteroids and comets are infrequent, catastrophic events.</p>
                <h3>Recent cycles</h3>
                <h4>Cycle 24</h4>
                <p>The current solar cycle began on January 4, 2008, with minimal activity until early 2010. It is on track to have the lowest recorded sunspot activity since accurate records began in 1750. The cycle featured a "double-peaked" solar maximum. The first peak was reached 99 in 2011 and the second in early 2014 at 101.</p>
                <h4>Cycle 23</h4>
                <p>This cycle lasted 11.6 years, beginning in May 1996 and ending in January 2008. The maximum smoothed sunspot number (monthly number of sunspots averaged over a twelve-month period) observed during the solar cycle was 120.8 (March 2000), and the minimum was 1.7. A total of 805 days had no sunspots during this cycle.</p>
                <p>Sources: <a href="http://sdo.gsfc.nasa.gov/mission/spaceweather.php" target="_blank">http://sdo.gsfc.nasa.gov/mission/spaceweather.php</a> and <a href="https://www.wikiwand.com/en/Solar_cycle" target="_blank">https://www.wikiwand.com/en/Solar_cycle</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default SolarCycle;
