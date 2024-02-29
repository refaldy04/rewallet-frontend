import React, { Component } from "react";

import phone from "../asset/img/Group 57.png";

export class Intro extends Component {
  render() {
    return (
      <div className="col-md-7 fw-intro d-flex flex-column justify-content-center">
        <h1 className="fw-brand text-light">ZWALLET</h1>
        <figure className="figure text-center">
          <img
            src={phone}
            className="figure-img img-fluid rounded"
            alt="phone-1"
          />
        </figure>

        <h3 className="fw-motto text-light">
          App that Covering Banking Needs.
        </h3>
        <p className="text-light mt-5">
          Zwallet is an application that focussing in banking needs for all
          users in the world. Always updated and always following world trends.
          5000+ users registered in Zwallet everyday with worldwide users
          coverage.
        </p>
      </div>
    );
  }
}

export default Intro;
