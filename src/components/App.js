import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import {
  getUsersRequest,
  createUserRequest,
  deleteUserRequest,
  usersError
} from "../actions/users";
import Users from "./Users";
import NewUserForm from "./NewUserForm";

class App extends Component {
  constructor(props) {
    super(props);
    this.props.getUsersRequest();
  }
  handleSubmit = ({ firstName, lastName }) => {
    console.log(firstName, lastName);
    this.props.createUserRequest({ firstName, lastName });
  };
  handleDeleteUser = id => {
    console.log(id);
    this.props.deleteUserRequest(id);
  };
  handleCloseAlert = () => {
    this.props.usersError({
      error: ""
    });
  };
  render() {
    const users = this.props.users;
    return (
      <div style={{ margin: "0 auto", padding: "20px", maxWidth: "600px" }}>
        <Alert
          color="danger"
          isOpen={!!this.props.users.error}
          toggle={this.handleCloseAlert}
        >
          {this.props.users.error}
        </Alert>
        <NewUserForm onSubmit={this.handleSubmit} />
        <Users users={users.items} onDeleteUser={this.handleDeleteUser} />
      </div>
    );
  }
}

export default connect(
  ({ users }) => ({ users }),
  { getUsersRequest, createUserRequest, deleteUserRequest, usersError }
)(App);
