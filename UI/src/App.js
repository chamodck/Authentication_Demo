import React, { Component } from "react";
import { Switch, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./assets/css/adminlte.min.css";

import AuthService from "./services/auth.service";
import UserService from "./services/user.service";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import EventBus from "./components/common/EventBus";
import PrivateRoute from './components/common/PrivateRoute';
import PublicRoute from './components/common/PublicRoute';


class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      content:""
    };
  }

  componentDidMount() {


    if(AuthService.isLoggedIn()){
 
      UserService.getUserProfile().then(
        response => {

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
    }

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

    const { currentUser} = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Demo
          </Link>
    

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.userName}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                Register
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>

            <PublicRoute restricted={false} component={Home} path={["/", "/home"]} exact />
            <PublicRoute restricted={true} component={Login} path="/login" exact />
            <PublicRoute restricted={true} component={Register} path="/register" exact />
            <PrivateRoute component={Profile} path="/profile" exact />


          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}

export default App;
