import React from "react";
import {Link, browserHistory} from "react-router";
import API from "icarus/api";
import utils from "icarus/utils";
import Loader from "icarus/views/Loader";
import WeatherEIT from "icarus/views/WeatherEIT";
import SolarWind from "icarus/views/graphs/SolarWind";
import ProtonFlux from "icarus/views/graphs/ProtonFlux";
import ElectronFlux from "icarus/views/graphs/ElectronFlux";
import XrayFlux from "icarus/views/graphs/XrayFlux";

export class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Weather";
    this.state = {
      data: [],
      solarWind: [],
      protonFlux: [],
      electronFlux: [],
      xrayFlux: [],
      width: 0,
      height: 0,
      isLoading: true
    };
    this.handleFluxComplete = this.handleFluxComplete.bind(this);
  }

  handleFluxComplete() {
    this.setState({
      isLoading: false
    });
  }

  loadSolarWind() {
    const minDateFormatted = utils.daysFrom(-7);
    return Promise.all([
      API.getSolarWind({
        date_min: minDateFormatted
      })
    ]).then((res) => {

      this.setState({
        solarWind: res.map((res) => res.body)
      });

      /*const graphLegends = utils.query(".Graph__legends");
      utils.clear(graphLegends);
      utils.addAll(graphLegends, [{"name": "temperature"}, {"name": "density"}].map((legend) => {
        const name = (legend.name === "density" ? "solarWind1" : "solarWind2");
        const colorClass = `Graph__legendColor--${name}`;
        return utils.tag("a", {
          "href": "#",
          "class": "Graph__legend"
        }, [
          utils.tag("div", { "class": colorClass }),
          utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
        ]);
      }));*/

    });
  }

  loadProtonFlux() {
    const minDateFormatted = utils.daysFrom(-7);
    return Promise.all([
      API.getProtonFlux({
        ptype: 1,
        date_min: minDateFormatted
      }),
      API.getProtonFlux({
        ptype: 3,
        date_min: minDateFormatted
      }),
      API.getProtonFluxTypes()
    ]).then((res) => {

      this.setState({
        protonFlux: res.map((res) => res.body)
      });

      /*const graphLegends = utils.query(".Graph__legends");
      utils.clear(graphLegends);
      utils.addAll(graphLegends, res[2].body.map((legend) => {
        const name = (legend.id === 1 ? "particle10" : "particle100");
        const colorClass = `Graph__legendColor--${name}`;
        return utils.tag("a", {
          "href": "#",
          "class": "Graph__legend"
        }, [
          utils.tag("div", { "class": colorClass }),
          utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
        ]);
      }));*/

    });
  }

  loadElectronFlux() {
    const minDateFormatted = utils.daysFrom(-7);
    return Promise.all([

      API.getElectronFlux({
        etype: 2,
        date_min: minDateFormatted
      }),

      API.getElectronFlux({
        etype: 1,
        date_min: minDateFormatted
      }),

      API.getElectronFluxTypes()

    ]).then((res) => {

      this.setState({
        electronFlux: res.map((res) => res.body)
      });

      /*const graphLegends = utils.query(".Graph__legends");
      utils.clear(graphLegends);
      utils.addAll(graphLegends, res[2].body.map((legend) => {
        const name = (legend.id === 1 ? "particle10" : "particle100");
        const colorClass = `Graph__legendColor--${name}`;
        return utils.tag("a", {
          "href": "#",
          "class": "Graph__legend"
        }, [
          utils.tag("div", { "class": colorClass }),
          utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
        ]);
      }));*/

    });
  }

  loadXrayFlux() {
    const minDateFormatted = utils.daysFrom(-7);
    return Promise.all([

      API.getXrayFlux({
        xtype: 1,
        date_min: minDateFormatted
      }),

      API.getXrayFlux({
        xtype: 2,
        date_min: minDateFormatted
      }),

      API.getXrayFluxTypes()

    ]).then((res) => {

      this.setState({
        xrayFlux: res.map((res) => res.body)
      });

      /*const graphLegends = utils.query(".Graph__legends");
      utils.clear(graphLegends);
      utils.addAll(graphLegends, res[2].body.map((legend) => {
      const name = (legend.id === 1 ? "particle10" : "particle100");
      const colorClass = `Graph__legendColor--${name}`;

      return utils.tag("a", {
         "href": "#",
         "class": "Graph__legend"
        }, [
         utils.tag("div", { "class": colorClass }),
         utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
        ]);
      }));*/

    });
  }

  loadFlux(flux) {
    if (!this.state.isLoading) {
      this.setState({
        isLoading: true
      });
    }

    switch(flux) {
    default: console.warn("default flux",flux);
    case "solar-wind": this.loadSolarWind().then(this.handleFluxComplete, this.handleFluxComplete); break;
    case "particle": this.loadProtonFlux().then(this.handleFluxComplete, this.handleFluxComplete); break;
    case "electron": this.loadElectronFlux().then(this.handleFluxComplete, this.handleFluxComplete); break;
    case "x-ray": this.loadXrayFlux().then(this.handleFluxComplete, this.handleFluxComplete); break;
    }
  }

  componentWillMount() {
    if (!this.props.location.query.filter
    || !this.props.location.query.flux) {
      browserHistory.replace({
        pathname: "/weather",
        query: {
          filter: 1,
          flux: "solar-wind"
        }
      });
    }

    this.loadFlux(this.props.location.query.flux);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query.flux !== nextProps.location.query.flux) {
      this.loadFlux(nextProps.location.query.flux);
    }
  }

  componentDidUpdate() {
    const {container} = this.refs;
    const {width,height} = container.getBoundingClientRect();
    if (this.state.width !== width && this.state.height !== height) {
      this.setState({
        width,
        height
      });
    }
  }

  renderGraph(flux) {
    const {width,height} = this.state;
    switch(flux) {
    default:
    case "solar-wind":
      return <SolarWind width={width} height={height} data={this.state.solarWind} />;
    case "particle":
      return <ProtonFlux width={width} height={height} data={this.state.protonFlux} />;
    case "electron":
      return <ElectronFlux width={width} height={height} data={this.state.electronFlux} />;
    case "x-ray":
      return <XrayFlux width={width} height={height} data={this.state.xrayFlux} />;
    }
  }

  render() {
    const flux = this.props.location.query.flux;
    const filter = this.props.location.query.filter;
    const {width,height} = this.state;
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
          <WeatherEIT filter={filter} />
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
            <Loader isLoading={this.state.isLoading}/>
            <div className="Graph">
              <div className="Graph__content" ref="container">
                {this.renderGraph(flux)}
              </div>
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
