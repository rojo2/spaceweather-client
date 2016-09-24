import React from "react";
import classNames from "classnames";

export class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Loader";
  }
  render() {
    const loaderClasses = classNames("Loader", {
      "isActive": this.props.isLoading
    });
    return (
      <div className={loaderClasses}>
        <svg viewBox="0 0 55 64" width="55" height="64" className="Loader__spinner">
          <rect x="0" y="0" width="1" height="64" className="Loader01"></rect>
          <rect x="6" y="0" width="1" height="64" className="Loader02"></rect>
          <rect x="12" y="0" width="1" height="64" className="Loader03"></rect>
          <rect x="18" y="0" width="1" height="64" className="Loader04"></rect>
          <rect x="24" y="0" width="1" height="64" className="Loader05"></rect>
          <rect x="30" y="0" width="1" height="64" className="Loader06"></rect>
          <rect x="36" y="0" width="1" height="64" className="Loader07"></rect>
          <rect x="42" y="0" width="1" height="64" className="Loader08"></rect>
          <rect x="48" y="0" width="1" height="64" className="Loader09"></rect>
          <rect x="54" y="0" width="1" height="64" className="Loader10"></rect>
        </svg>
      </div>
    );
  }
}

Loader.propTypes = {
  isLoading: React.PropTypes.boolean
};

export default Loader;
