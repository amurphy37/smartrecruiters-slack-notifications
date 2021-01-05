import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LandingPage from "./landingpage"
import Register from "./register"
import LogIn from "./login"
import SlackApp from "./addToSlack"
import PrivateRoute from "./privateRoute"
import SlackAppRedirect from "./slackAppRedirect"
import Home from "./home"
import SmartKey from "./smartKey"

function Main(props) {
    return (
        <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={LogIn} />
            <PrivateRoute exact path="/addSlack" component={SlackApp} />
            <PrivateRoute exact path="/smartKey" component={SmartKey} />
            <Route exact path="/slackAppAdd" component={SlackAppRedirect} />
            <Route exact path="/home" component={Home} />

        </Switch>
    )

}

export default Main;