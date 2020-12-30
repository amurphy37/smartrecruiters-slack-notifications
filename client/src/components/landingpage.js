import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom'

class Landing extends Component {
    render() {
        return (
            <div className="container" id="landing-container">
                <h1>SmartRecruiters Slack Notifications</h1>
                <h2>Connect your Slack workspace to your SmartRecruiters account to receive slack notifications for new jobs and offers</h2>
                <Link to="/register"><Button className="registerBtn">Register</Button></Link>
                <Link to="/login">Already a member? Click to log in.</Link>
            </div>
        )
    }
}

export default Landing;