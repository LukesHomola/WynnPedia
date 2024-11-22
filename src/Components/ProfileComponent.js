import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-brands-svg-icons";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import "../CSS/ProfileComponent.css";
import profileAvatarHead from "../Assests_components/Profile_head_placeholder.png";
import profileAvatarBody from "../Assests_components/Profile_body_placeholder.png";

const Profile = () => {
  return (
    <div className="profile_component">
      <div className="profile_grid_container">
        <section className="profile_grid_left">
          <div className="profile_grid_inner_container_top">
            <section className="flex">
              <img
                src={profileAvatarHead}
                className="grid_container_top_avatar"
              ></img>
            </section>

            <section className="flex-col gap-05 ">
              <span className="flex gap-05">
                <h2>RANK</h2>
                <h2>NICKNAME</h2>
              </span>
              <section>
                <h5 className="force-regular">ONLINE STATUS</h5>
                <h5 className="force-regular">GUILD STATUS</h5>
              </section>
            </section>
          </div>
          <div className="profile_grid_inner_container_bottom">
            <section className="flex-col">
              <img
                src={profileAvatarBody}
                className="grid_container_bottom_avatar"
              ></img>
              <section className="flex-center gap-1">
                <h3>
                  <FontAwesomeIcon icon={faCircleArrowLeft} />
                </h3>
                <h3>
                  <FontAwesomeIcon icon={faUser} />
                </h3>
                <h3>
                  <FontAwesomeIcon icon={faCircleArrowRight} />
                </h3>
              </section>
              <br></br>
              {/*               <hr style={{ width: "500px", margin: "0 auto" }}></hr>
               */}{" "}
              <br></br>
              <br></br>
            </section>
            <section className="flex-col gap-05 grid_bottom_stats">
              <h3>Personal stats</h3>
              <br></br>
              <span className="flex gap-05">
                <h4 className="force-regular">First join:</h4>
                <h4>XXX</h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular">Total levels:</h4>
                <h4>XXX</h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular">Total playtime:</h4>
                <h4>XXX</h4>
              </span>
              <span className="flex gap-05">
                <h4 className="force-regular">Total mobs killed:</h4>
                <h4>XXX</h4>
              </span>
            </section>
          </div>
        </section>
        <section className="profile_grid_right">
          <div className="stats_grid_top">
            <h3>Your rankings</h3>
          </div>
          <div className="stats_grid_bottom">
            <h3>Your characters</h3>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
