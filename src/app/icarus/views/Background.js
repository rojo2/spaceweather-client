import React from "react";

export class Background extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Background";
  }
  render() {
    return (
      <div className="Background">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="Bokeh">
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="100"></feGaussianBlur>
            </filter>
            <filter id="blur--2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="50"></feGaussianBlur>
            </filter>
          </defs>
          <circle cx="-4%" cy="0%" r="22%" filter="url(#blur)" className="Bokeh__particle--red"></circle>
          <circle cx="75%" cy="110%" r="20%" filter="url(#blur)" className="Bokeh__particle--yellow"></circle>
          <circle cx="95%" cy="40%" r="9%" filter="url(#blur)" className="Bokeh__particle--red"></circle>
          <circle cx="110%" cy="100%" r="30%" filter="url(#blur)" className="Bokeh__particle--magenta"></circle>
          <circle cx="64%" cy="55%" r="6%" filter="url(#blur--2)" className="Bokeh__particle--yellow"></circle>
          <circle cx="20%" cy="-3%" r="12%" filter="url(#blur--2)" className="Bokeh__particle--magenta"></circle>
        </svg>
      </div>
    );
  }
}

export default Background;
