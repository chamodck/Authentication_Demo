import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";

import EventBus from "../common/EventBus";

const ColoredLine = ({ color }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color
        
      }}
  />
);

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    debugger;

    UserService.getUserProfile().then(
      response => {
        debugger;
        this.setState({
          currentUser: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );

    EventBus.on("logout", () => {
      this.logOut();
    });
  }
  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  
  render() {

    const { currentUser } = this.state;

    return (
      <div className="container">
        {currentUser ? (
          <div>



            <div className="container-fluid">
              <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6 col-md-offset-3">

                  <div className="card card-primary card-outline">
                    <div className="card-body box-profile">
                      <div className="text-center">
                        <img
                          className="profile-user-img img-fluid img-circle"
                          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                          alt="User profile picture"
                        />
                      </div>

                      <h3 className="profile-username text-center">

                      </h3>

                      <div className="row">
                        <div className="col-4 ">
                          <b>User Name</b>
                        </div>
                        <div className="col-8">
                          <span>{currentUser.userName}</span>
                        </div>
                      </div>
                      <ColoredLine color="gray" />
                      <div className="row">
                        <div className="col-4 ">
                          <b>First Name</b>
                        </div>
                        <div className="col-8">
                          <span>{currentUser.firstName}</span>
                        </div>
                      </div>
                      <ColoredLine color="gray" />
                      <div className="row">
                        <div className="col-4">
                          <b>Last Name</b>
                        </div>
                        <div className="col-8">
                          <span>{currentUser.lastName}</span>
                        </div>
                      </div>
                      <ColoredLine color="gray" />
                      <div className="row">
                        <div className="col-4">
                          <b>Email</b>
                        </div>
                        <div className="col-8">
                          <span>{currentUser.email}</span>
                        </div>
                      </div>


                    </div>

                  </div>

                </div>
              </div>

            </div>



          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
