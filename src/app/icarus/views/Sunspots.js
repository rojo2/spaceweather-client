import React from "react";
import Loader from "icarus/views/Loader";

function sunspotCoord(value, positive = false) {
  return Math.sin(Math.PI * (positive ? 0.5 : -0.5)) * Math.sin(value);
}

function parseSunspot(data) {
  const NS = (data.substr(0,1) === "N" ? false : true);
  const WE = (data.substr(3,1) === "W" ? true : false);

  const alpha = (parseInt(data.substr(1,2),10) / 90) * Math.PI * 0.5;
  const beta = (parseInt(data.substr(4,2),10) / 90) * Math.PI * 0.5;

  const x = sunspotCoord(beta, WE);
  const y = sunspotCoord(alpha, NS);

  return { x, y };
}

export class Sunspots extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = "Sunspots";
  }

  componentWillMount() {
    const minDateFormatted = utils.daysFrom(-1);
    const maxDateFormatted = utils.daysFrom(-1);
    const minDateFormattedImage = utils.daysFrom(-2);
    const maxDateFormattedImage = utils.daysFrom(0);
    Promise.all([
      API.getImageChannels({
        channeltype: 5,
        date_min: minDateFormattedImage,
        date_max: maxDateFormattedImage
      }),
      API.getSunspotRegions({
        date_min: minDateFormatted,
        date_max: maxDateFormatted
      })
    ]).then((res) => {
      let images = [];
      res[0].body.forEach((image) => {
        if (new Date(image.date).getHours() === 17) {
          images.push(image);
        }
      });
      //utils.deactivate(utils.query(".Loader", container));
      //graphs.sunspots(container, images, res[1].body);
    });
  }

  render() {
    return (
      <section className="Sunspots isActive">
        <div className="Sunspots__image">
          <div className="Panel__header">
            <div className="Panel__title">Sunspots</div>
          </div>
          <div className="Panel__content">
            <Loader />
            <div className="Graph">
              <div className="Graph__content">

              </div>
            </div>
          </div>
          <div className="Panel__footer"></div>
        </div>
        <div className="Sunspots__description">
          <div className="Panel__content--text">
            <div className="ScrolledContent">
              <div className="Text__header">Sunspots</div>
              <div className="Text__body">
                <p>Sunspots are temporary phenomena on the photosphere of the Sun that appear visibly as dark spots compared to surrounding regions. They correspond to concentrations of magnetic field flux that inhibit convection and result in reduced surface temperature compared to the surrounding photosphere. Sunspots usually appear in pairs, with pair members of opposite magnetic polarity. The number of sunspots varies according to the approximately 11-year solar cycle.</p>
                <p>Individual sunspots may endure anywhere from a few days to a few months, but eventually decay. Sunspots expand and contract as they move across the surface of the Sun with a size ranging from 16 kilometers to 160,000 kilometers in diameter. The larger variety are visible from Earth without the aid of a telescope. They may travel at relative speeds ("proper motions") of a few hundred meters per second when they first emerge.</p>
                <p>Reflecting intense magnetic activity, sunspots accompany secondary phenomena such as coronal loops (prominences) and reconnection events. Most solar flares and coronal mass ejections originate in magnetically active regions around visible sunspot groupings. Similar phenomena indirectly observed on stars other than the sun are commonly called starspots and both light and dark spots have been measured.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default Sunspots;
