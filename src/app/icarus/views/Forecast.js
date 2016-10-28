import React from "react";
import {Link, browserHistory} from "react-router";
import Loader from "icarus/views/Loader";
import classNames from "classnames";
import API from "icarus/api";
import utils from "icarus/utils";

export class Forecast extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Forecast";
    this.state = {
      alerts: [],
      geomagActivityItems: null,
      solarRadiationItems: null,
      radioBlackoutItems: null,
      geomagActivity: null,
      solarRadiation: null,
      radioBlackout: null
    };

    this.renderAlerts = this.renderAlerts.bind(this);
    this.renderForecast = this.renderForecast.bind(this);
  }

  getMonthAbbr(index) {
    const abbrs = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    return abbrs[index];
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
  }

  componentDidMount() {
    API.getAlerts({
      ordering: "-issuetime",
      limit: 50
    }).then((res) => {
      this.setState({ alerts: res.body });
    }).catch((err) => console.error(err));

    API.getGeomagneticActivity({
      date_min: utils.daysFrom(-3),
      ordering: "-date"
    }).then((res) => {
      return utils.radio(res.body);
    }).then((items) => {
      this.setState({ geomagActivityItems: items });
    }).catch((err) => console.error(err));

    API.getSolarRadiation({
      date_min: utils.daysFrom(-3),
      ordering: "-date",
      solarradiationtype: 2
    }).then((res) => {
      utils.ts(res.body, "date");
      this.setState({ solarRadiation2Items: res.body });
    }).catch((err) => console.error(err));

    API.getSolarRadiation({
      date_min: utils.daysFrom(-3),
      ordering: "-date"
    }).then((res) => {
      utils.ts(res.body, "date");
      this.setState({ solarRadiationItems: res.body });
    }).catch((err) => console.error(err));

    API.getRadioBlackout({
      date_min: utils.daysFrom(-3),
      ordering: "-date"
    }).then((res) => {
      utils.ts(res.body, "date");
      this.setState({ radioBlackoutItems: res.body });
    }).catch((err) => console.error(err));

    API.getForecast().then((res) => {
      const rationale = res.body.pop();
      this.setState({
        solarRadiation: rationale.solarradiation,
        geomagActivity: rationale.geomagactivity,
        radioBlackout: rationale.radioBlackout
      });
    }).catch((err) => console.error(err));
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
    console.log(this.state);
    if (!this.state.radioBlackoutItems
     || !this.state.solarRadiationItems
     || !this.state.geomagActivityItems) {
      return null;
    }

    const [firstRadioBlackout,secondRadioBlackout,thirdRadioBlackout] = this.state.radioBlackoutItems;
    const [firstSolarRadiation,secondSolarRadiation,thirdSolarRadiation] = this.state.solarRadiationItems;
    const [firstGeomagActivity,secondGeomagActivity,thirdGeomagActivity] = this.state.geomagActivityItems;

    const firstTransformGeomagActivity = { transform: `scaleY(${firstGeomagActivity.value * 0.01})` };
    const firstTransformSolarRadiation = { transform: `scaleY(${firstSolarRadiation.value * 0.01})` };
    const firstTransformBlackout = { transform: `scaleY(${firstRadioBlackout.value * 0.01})` };

    const secondTransformGeomagActivity = { transform: `scaleY(${secondGeomagActivity.value * 0.01})` };
    const secondTransformSolarRadiation = { transform: `scaleY(${secondSolarRadiation.value * 0.01})` };
    const secondTransformBlackout = { transform: `scaleY(${secondRadioBlackout.value * 0.01})` };

    const thirdTransformGeomagActivity = { transform: `scaleY(${thirdGeomagActivity.value * 0.01})` };
    const thirdTransformSolarRadiation = { transform: `scaleY(${thirdSolarRadiation.value * 0.01})` };
    const thirdTransformBlackout = { transform: `scaleY(${thirdRadioBlackout.value * 0.01})` };

    return (
      <section className="Forecast isActive">
      <div className="Forecast__graphs">
          <div className="Panel__header">
              <div className="Panel__title">3-day Forecast</div>
          </div>
          <div className="Panel__content">
              <div className="Forecast__days">
                  <div className="Forecast__day">
                      <div className="Forecast__dayLabel">{this.getMonthAbbr(firstRadioBlackout.ts.getMonth())} {firstRadioBlackout.ts.getDate()}</div>
                      <div className="Forecast__dayData">
                          <div className="GraphDanger">
                              <div className="GraphDanger__geomagnetic">
                                  <div className="GraphDanger__geomagneticFill" style={firstTransformGeomagActivity}></div>
                              </div>
                              <div className="GraphDanger__solar">
                                  <div className="GraphDanger__solarFill" style={firstTransformSolarRadiation}></div>
                              </div>
                              <div className="GraphDanger__blackout">
                                  <div className="GraphDanger__blackoutFill" style={firstTransformBlackout}></div>
                              </div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--geomagnetic">Geomagnetic Activity</div>
                              <div className="Forecast__statsValue--geomagnetic">2 / {firstRadioBlackout.value}</div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--solar">Solar Radiation Activity</div>
                              <div className="Forecast__statsValue--solar">{firstSolarRadiation.value}%</div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--blackout">Radio Blackout Activity</div>
                              <div className="Forecast__statsValue--blackout">{firstRadioBlackout.value}%</div>
                          </div>
                      </div>
                  </div>
                  <div className="Forecast__day">
                      <div className="Forecast__dayLabel">{this.getMonthAbbr(secondRadioBlackout.ts.getMonth())} {secondRadioBlackout.ts.getDate()}</div>
                      <div className="Forecast__dayData">
                          <div className="GraphDanger">
                            <div className="GraphDanger__geomagnetic">
                                <div className="GraphDanger__geomagneticFill" style={secondTransformGeomagActivity}></div>
                            </div>
                            <div className="GraphDanger__solar">
                                <div className="GraphDanger__solarFill" style={secondTransformSolarRadiation}></div>
                            </div>
                            <div className="GraphDanger__blackout">
                                <div className="GraphDanger__blackoutFill" style={secondTransformBlackout}></div>
                            </div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--geomagnetic">Geomagnetic Activity</div>
                              <div className="Forecast__statsValue--geomagnetic">2 / {secondGeomagActivity.value}</div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--solar">Solar Radiation Activity</div>
                              <div className="Forecast__statsValue--solar">{secondSolarRadiation.value}%</div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--blackout">Radio Blackout Activity</div>
                              <div className="Forecast__statsValue--blackout">{secondRadioBlackout.value}%</div>
                          </div>
                      </div>
                  </div>
                  <div className="Forecast__day">
                      <div className="Forecast__dayLabel">{this.getMonthAbbr(thirdRadioBlackout.ts.getMonth())} {thirdRadioBlackout.ts.getDate()}</div>
                      <div className="Forecast__dayData">
                          <div className="GraphDanger">
                            <div className="GraphDanger__geomagnetic">
                                <div className="GraphDanger__geomagneticFill" style={thirdTransformGeomagActivity}></div>
                            </div>
                            <div className="GraphDanger__solar">
                                <div className="GraphDanger__solarFill" style={thirdTransformSolarRadiation}></div>
                            </div>
                            <div className="GraphDanger__blackout">
                                <div className="GraphDanger__blackoutFill" style={thirdTransformBlackout}></div>
                            </div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--geomagnetic">Geomagnetic Activity</div>
                              <div className="Forecast__statsValue--geomagnetic">2 / {thirdGeomagActivity.value}</div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--solar">Solar Radiation Activity</div>
                              <div className="Forecast__statsValue--solar">{thirdSolarRadiation.value}%</div>
                          </div>
                          <div className="Forecast__stats">
                              <div className="Forecast__statsLabel--blackout">Radio Blackout Activity</div>
                              <div className="Forecast__statsValue--blackout">{thirdRadioBlackout.value}%</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="Panel__footer">

          </div>
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
          <div className="Panel__footer">

          </div>
        </div>
      </section>
    );
  }
}

export default Forecast;
