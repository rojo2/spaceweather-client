
export class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Alert";
  }
  render() {
    return (
      <div className="Alert {alerttype}">
        <input type="checkbox" id="{id}" className="Alert__input">
        <label htmlFor="{id}" className="Alert__basicInfo">
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
}
