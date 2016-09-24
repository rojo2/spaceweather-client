import React from "react";
import Loader from "icarus/views/Loader";

export class SolarCycle extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "SolarCycle";
  }
  render() {
    return (
      <section className="SolarCycle isActive">
        <div className="SolarCycle__graph">
          <div className="Panel__header">
            <div className="Panel__title">Solar Cycle</div>
          </div>
          <div className="Panel__content">
            <Loader />
            <div className="Graph">
              <div className="Graph__content"></div>
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
          <div className="Panel__footer"></div>
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
