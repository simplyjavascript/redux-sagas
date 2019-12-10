import React, { Component } from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
const Users = ({ users, onDeleteUser }) => {
  return (
    <ListGroup>
      {users
        .sort((a, b) => {
          if (a.firstName > b.firstName) {
            return 1;
          } else if (a.firstName < b.firstName) {
            return -1;
          } else if (a.lastName > b.lastName) {
            return 1;
          } else if (a.lastName < b.lastName) {
            return -1;
          } else {
            return 0;
          }
        })
        .map(user => {
          return (
            <ListGroupItem key={user.id}>
              <section style={{ display: "flex" }}>
                <div style={{ flexGrow: 1, margin: "auto 0" }}>
                  {user.firstName} {user.lastName}
                </div>
                <Button
                  onClick={() => onDeleteUser(user.id)}
                  outline
                  color="danger"
                >
                  Delete
                </Button>
              </section>
            </ListGroupItem>
          );
        })}
    </ListGroup>
  );
};

export default Users;
