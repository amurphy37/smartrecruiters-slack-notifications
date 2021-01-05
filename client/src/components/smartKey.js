import React, { Component } from 'react';
import Axios from 'axios'

class SmartKey extends Component {

    constructor(props) {
        super(props)
        this.state= {
            apiKey: ""
        }

        this.resetUserInputs = this.resetUserInputs.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    resetUserInputs = () => {
        this.setState({
            apiKey: "",
            companyID: ""
        });
    };

    handleInputChange = event => {
        // Getting the value and name of the input which triggered the change
        const { name, value } = event.target;

        // Updating the input's state
        this.setState({
            [name]: value
        });
    };

    handleFormSubmit = event => {
        event.preventDefault()

        const payload = {
            smartKey: this.state.apiKey,
            companyIdentifier: this.state.companyID
        }

        Axios
            .post("/api/smartAuth", payload)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    console.log("200")

                    window.location = "/home"
                }
            })
            .catch(error => {
                console.log("API Key Error: ")
                console.log(error);
                window.location = "/smartKey"
            })

    }

    render() {

        return (
 
                <div>
                    <div>
                        <h2 className="justify-content-center smartHeader">Enter SmartRecruiters API Key and Company Identifier</h2>
                    </div>
                    <div className="d-flex justify-content-center form_container_login">
                        <form>
                            <div className="input-group mb-3">
                                <div className="input-group-append">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                </div>
                                <input
                                    value={this.state.apiKey}
                                    name="apiKey"
                                    onChange={this.handleInputChange}
                                    type="text"
                                    className="form-control input_user_login"
                                    placeholder="API Key"
                                >
                                </input>
                            </div>
                            <div className="input-group mb-3">
                            <div className="input-group-append">
                                <span className="input-group-text"><i className="fas fa-user"></i></span>
                            </div>
                                <input
                                    value={this.state.companyID}
                                    name="companyID"
                                    onChange={this.handleInputChange}
                                    type="text"
                                    className="form-control input_user_login"
                                    placeholder="Company Identifier"
                                >
                                </input>
                            </div>
                            <br></br>
                            <div className="d-flex justify-content-center mt-3 login_container">
                                <button onClick={this.handleFormSubmit} className="btn login_btn">Enter</button>
                            </div>
                        </form>
                    </div>

                </div>
        )
    }
}

export default SmartKey