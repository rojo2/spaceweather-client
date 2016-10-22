import React from "react";
import {Link, browserHistory} from "react-router";
import Loader from "icarus/views/Loader";
import classNames from "classnames";
import API from "icarus/api";

export class Forecast extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Forecast";
    this.state = {
      alerts: []
    };

    this.renderAlerts = this.renderAlerts.bind(this);
    this.renderForecast = this.renderForecast.bind(this);
  }

  componentWillMount() {
    if (!this.props.location.query.filter
    || !this.props.location.query.flux) {
      browserHistory.replace({
        pathname: "/forecast",
        query: {
          show: "forecast"
        }
      });
    }

    API.getAlerts({
      ordering: "-issuetime",
      limit: 50
    }).then((res) => {
      this.setState({
        alerts: res.body
      });
    }).catch((err) => {
      console.error(err);
    });

    API.getForecast().then((res) => {
      const rationale = res.body.pop();
      this.setState({
        solarRadiation: rationale.solarradiation,
        geomagActivity: rationale.geomagactivity,
        radioBlackout: rationale.radioBlackout
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  renderAlert(alert) {
    const {id,alerttype, issuetime,SWMC,message,payload} = alert;
    const alertClasses = classNames("Alert", {
      "Alert--summary": alerttype === 1,
      "Alert--warning": alerttype === 2,
      "Alert--extendedWarning": alerttype === 3,
      "Alert--cancelWarning": alerttype === 4,
    });
    return (
      <div className={alertClasses} key={id}>
        <input type="checkbox" id={id} className="Alert__input" />
        <label htmlFor={id} className="Alert__basicInfo">
          <div className="Alert__metadata">
            <div className="Alert__issueTime">{issuetime}</div>
            <div className="Alert__SWMC">{SWMC}</div>
          </div>
          <div className="Alert__message">{message}</div>
        </label>
        <div className="Alert__extendedInfo">
          <div className="Alert__payload">{payload}</div>
        </div>
      </div>
    );
  }

  renderAlerts() {
    const alerts = this.state.alerts.map(this.renderAlert);
    return (
      <div className="Alerts">
        {alerts}
      </div>
    );
  }

  renderSolarRadiation() {
    if (this.state.solarRadiation) {
      return (
        <div>
          <h3>Solar Radiation Storms</h3>
          <p>{this.state.solarRadiation}</p>
        </div>
      );
    }
    return null;
  }

  renderGeomagneticActivity() {
    if (this.state.geomagActivity) {
      return (
        <div>
          <h3>Geomagnetic Activity</h3>
          <p>{this.state.geomagActivity}</p>
        </div>
      );
    }
    return null;
  }

  renderRadioBlackout() {
    if (this.state.radioBlackout) {
      return (
        <div>
          <h3>Radio Blackout (>=R3)</h3>
          <p>{this.state.radioBlackout}</p>
        </div>
      );
    }
    return null;
  }

  renderForecast() {
    return (
      <div className="Forecast__rationale">
        {this.renderSolarRadiation()}
        {this.renderGeomagneticActivity()}
        {this.renderRadioBlackout()}
      </div>
    );
  }

  renderRightPanel() {
    const fn = (this.props.location.query.show === "alerts" ? this.renderAlerts : this.renderForecast);
    return (
      <div className="Panel__content">
        <Loader />
        {fn()}
      </div>
    );
  }

  render() {

    return (
      <section className="Forecast isActive">
        <div className="Forecast__graphs">
          <div className="Panel__header">
            <div className="Panel__title">3-day Forecast</div>
          </div>
          <div className="Panel__content">
            <div className="Forecast__days">
              <div className="Forecast__day">
                <div className="Forecast__dayLabel">Dec 26</div>
                <div className="Forecast__dayData">
                  <svg width="100%" height="100%" viewBox="0 0 102 102" className="RadialDanger">
                    <g>
                      <circle cx="50" cy="50" className="RadialDanger__geomagnetic"></circle>
                      <circle cx="50" cy="50" className="RadialDanger__solar"></circle>
                      <circle cx="50" cy="50" className="RadialDanger__blackout"></circle>
                    </g>
                    <g>
                      <line x1="50" y1="50" x2="50" y2="0" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="0" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="50" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="50" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="50" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="0" className="RadialDanger__divider"></line>
                    </g>
                    <g>
                      <circle cx="50" cy="50" r="10" className="RadialDanger__base--initial"></circle>
                      <circle cx="50" cy="50" r="50" className="RadialDanger__base"></circle>
                    </g>
                  </svg>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--geomagnetic">Geomagnetic Activity</div>
                    <div className="Forecast__statsValue--geomagnetic">8 / 2</div>
                  </div>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--solar">Solar Radiation Activity</div>
                    <div className="Forecast__statsValue--solar">
                      <div className="Forecast__statsSubValue">R1-R2 5%</div>
                      <div className="Forecast__statsSubValue">R3 15%</div>
                    </div>
                  </div>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--blackout">Radio Blackout Activity</div>
                    <div className="Forecast__statsValue--blackout">10%</div>
                  </div>
                </div>
              </div>
              <div className="Forecast__day">
                <div className="Forecast__dayLabel">Dec 27</div>
                <div className="Forecast__dayData">
                  <svg width="100%" height="100%" viewBox="0 0 102 102" className="RadialDanger">
                    <g>
                      <circle cx="50" cy="50" className="RadialDanger__geomagnetic"></circle>
                      <circle cx="50" cy="50" className="RadialDanger__solar"></circle>
                      <circle cx="50" cy="50" className="RadialDanger__blackout"></circle>
                    </g>
                    <g>
                      <line x1="50" y1="50" x2="50" y2="0" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="0" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="50" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="50" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="50" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="0" className="RadialDanger__divider"></line>
                    </g>
                    <g>
                      <circle cx="50" cy="50" r="10" className="RadialDanger__base--initial"></circle>
                      <circle cx="50" cy="50" r="50" className="RadialDanger__base"></circle>
                    </g>
                  </svg>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--geomagnetic">Geomagnetic Activity</div>
                    <div className="Forecast__statsValue--geomagnetic">2 / 2</div>
                  </div>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--solar">Solar Radiation Activity</div>
                    <div className="Forecast__statsValue--solar">
                      <div className="Forecast__statsSubValue">R1-R2 5%</div>
                      <div className="Forecast__statsSubValue">R3 15%</div>
                    </div>
                  </div>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--blackout">Radio Blackout Activity</div>
                    <div className="Forecast__statsValue--blackout">10%</div>
                  </div>
                </div>
              </div>
              <div className="Forecast__day">
                <div className="Forecast__dayLabel">Dec 28</div>
                <div className="Forecast__dayData">
                  <svg width="100%" height="100%" viewBox="0 0 102 102" className="RadialDanger">
                    <g>
                      <circle cx="50" cy="50" className="RadialDanger__geomagnetic"></circle>
                      <circle cx="50" cy="50" className="RadialDanger__solar"></circle>
                      <circle cx="50" cy="50" className="RadialDanger__blackout"></circle>
                    </g>
                    <g>
                      <line x1="50" y1="50" x2="50" y2="0" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="0" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="50" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="100" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="50" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="100" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="50" className="RadialDanger__divider"></line>
                      <line x1="50" y1="50" x2="0" y2="0" className="RadialDanger__divider"></line>
                    </g>
                    <g>
                      <circle cx="50" cy="50" r="10" className="RadialDanger__base--initial"></circle>
                      <circle cx="50" cy="50" r="50" className="RadialDanger__base"></circle>
                    </g>
                  </svg>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--geomagnetic">Geomagnetic Activity</div>
                    <div className="Forecast__statsValue--geomagnetic">4 / 2</div>
                  </div>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--solar">Solar Radiation Activity</div>
                    <div className="Forecast__statsValue--solar">
                      <div className="Forecast__statsSubValue">R1-R2 5%</div>
                      <div className="Forecast__statsSubValue">R3 15%</div>
                    </div>
                  </div>
                  <div className="Forecast__stats">
                    <div className="Forecast__statsLabel--blackout">Radio Blackout Activity</div>
                    <div className="Forecast__statsValue--blackout">10%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Panel__footer"></div>
        </div>
        <div className="Forecast__alerts">
          <div className="Panel__header">
            <div className="Panel__title">Alerts</div>
            <div className="Panel__menu">
              <Link to={{ pathname: "/forecast", query: { show: "forecast" }}} activeClassName="isActive" className="Panel__menuItem">Forecast</Link>
              <Link to={{ pathname: "/forecast", query: { show: "alerts" }}} activeClassName="isActive" className="Panel__menuItem">Alerts</Link>
            </div>
          </div>
          {this.renderRightPanel()}
          <div className="Panel__footer"></div>
        </div>
      </section>
    );
  }
}

export default Forecast;
