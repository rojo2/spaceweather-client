import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'

import Layout from '@/views/Layout'
import Weather from '@/views/Weather'
import Sunspots from '@/views/Sunspots'
import SolarCycle from '@/views/SolarCycle'
import Forecast from '@/views/Forecast'

export class Application extends React.Component {
  constructor(props) {
    super(props)
    this.displayName = 'Application'
  }
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Layout}>
          <Route path="weather" component={Weather} />
          <Route path="sunspots" component={Sunspots} />
          <Route path="solar-cycle" component={SolarCycle} />
          <Route path="forecast" component={Forecast} />
          <IndexRedirect to="/weather" />
        </Route>
      </Router>
    )
  }
}

ReactDOM.render(<Application />, document.querySelector('#Application'))
