import React, { Component } from 'react';
import { Button } from 'reactstrap';
import config from "../constants"



class SlackApp extends Component {
    render() {

        return (
            <div>
                <div>
                    <h2 className="addToSlack">Install App to your Slack Workspace</h2>
                    {config.url.API_URL === "http://localhost:3000" ?
                        (
                            <a href="https://slack.com/oauth/v2/authorize?client_id=273664409857.1607139541536&scope=channels:read,chat:write.customize,chat:write&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FslackAppAdd&user_scope=channels:history,links:read,channels:read,groups:read,mpim:read,im:read">
                                <img className="addToSlackButton" alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
                            </a>
                        ) :
                        (
                            <a href="https://slack.com/oauth/v2/authorize?client_id=273664409857.1607139541536&scope=channels:read,chat:write.customize,chat:write&redirect_uri=https%3A%2F%2Fhttps://smartrecruitersslack.herokuapp.com/%2FslackAppAdd&user_scope=channels:history,links:read,channels:read,groups:read,mpim:read,im:read">
                                <img className="addToSlackButton" alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
                            </a>
                        )}
                </div>
            </div>
        )


    }
}

export default SlackApp;