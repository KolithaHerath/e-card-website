import React, { useState } from "react";
import NotificationList from "./NotificationList";
import ConnectionList from "../connections/ConnectionList";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Card, Paper, CardContent } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grow from "@material-ui/core/Grow";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function Dashboard(props) {
  const [term, setTerm] = useState("");
  const [item, setItem] = useState("First Name");
  const [id, setID] = useState("fN");

  const classes = useStyles();

  function searchBar(e) {
    setTerm(e.target.value);
  }
  const handleChange = (event) => {
    setItem(event.target.value);
  };

  function handleID(e) {
    setID(e.target.id);
  }

  const conn_list = [];
  const notify_list = [];
  var num = 0;
  const { profiles, auth, current_user, notification } = props;

  //check if the user is logged in or not
  if (!auth.uid) return <Redirect to="/login" />;

  //check if the eamil is verified or not
  if (!auth.emailVerified) return <Redirect to="/verify" />;
  //check if the user is an admin
  if (current_user.status) return <Redirect to="/dashboard" />;
  //check if the user has created a profile or not
  if (current_user.isLoaded && current_user.isEmpty)
    return <Redirect to="/create" />;

  if (current_user.isLoaded && !current_user.isEmpty) {
    num = current_user.conn.length;
  }
  profiles &&
    profiles.map((user) => {
      if (current_user.conn != null) {
        for (var i = 0; i < current_user.conn.length; i++) {
          if (current_user.conn[i] === user.id) {
            conn_list.push(user);
          }
        }
      }
      return null;
    });

  notification &&
    notification.map((user) => {
      if (current_user.conn != null) {
        for (var i = 0; i < current_user.conn.length; i++) {
          if (current_user.conn[i] === user.id) {
            notify_list.push(user);
          }
        }
      }
      return null;
    });
  const checked = true;
  if (profiles !== undefined && !current_user.status) {
    return (
      <div
        className={classes.root}
        style={{ marginTop: "15px", marginBottom: "20px" }}
      >
        <Paper elevation={3} style={{ width: "90%", margin: "auto" }}>
          <div align="center">
            <Typography variant="h3">
              Dashboard
              <hr />
            </Typography>
          </div>
          <Grid container spcing={2}>
            <Grow
              in={checked}
              style={{ transformOrigin: "0 0 0" }}
              {...(checked ? { timeout: 1000 } : {})}
            >
              <Grid item xs={6}>
                <div
                  className={classes.paper}
                  style={{ display: "flex", marginLeft: "60px" }}
                >
                  <TextField
                    id="filled-basic"
                    label="Search"
                    variant="outlined"
                    onChange={searchBar}
                    style={{ width: "75%", marginRight: 0 }}
                  />
                  <div
                    style={{
                      float: "right",
                      marginLeft: 0,
                      paddingTop: "8px",
                      paddingLeft: "2px",
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Search By
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={item}
                      onChange={handleChange}
                      disableUnderline={true}
                    >
                      <MenuItem
                        id="fN"
                        value={"First Name"}
                        onClick={(e) => handleID(e)}
                      >
                        First Name
                      </MenuItem>
                      <MenuItem
                        id="lN"
                        value={"Last Name"}
                        onClick={(e) => handleID(e)}
                      >
                        Last Name
                      </MenuItem>
                      <MenuItem
                        id="cmp"
                        value={"Company"}
                        onClick={(e) => handleID(e)}
                      >
                        Company
                      </MenuItem>
                    </Select>
                  </div>
                </div>
                <div
                  align="center"
                  style={{
                    margin: "auto",
                    width: "80%",
                  }}
                >
                  <Typography variant="h5">
                    Your Card List <hr />
                  </Typography>
                </div>
                {conn_list.length !== 0 ? (
                  <div style={{ overflow: "auto", height: "380px" }}>
                    {conn_list.filter(searchingFor(term, id)).map((person) => (
                      <ul key={person.id}>
                        <ConnectionList profiles={person} />
                        {/* Display the list of connection the user has */}
                      </ul>
                    ))}
                  </div>
                ) : (
                  <div align="center" style={{ height: "250px" }}>
                    <Typography variant="h6">
                      Currently you don't have any Cards
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grow>
            <Grow
              in={checked}
              style={{ transformOrigin: "0 0 0" }}
              {...(checked ? { timeout: 1000 } : {})}
            >
              <Grid item xs={6}>
                <Card
                  align="center"
                  style={{
                    margin: "auto",
                    width: "70%",
                    marginBottom: "28px",
                    background: "#3f51b5",
                    color: "white",
                    height: "100px",
                  }}
                >
                  <CardContent>
                    <Typography variant="h4">
                      {current_user.fN} {current_user.lN}
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{
                        paddingTop: "10px",
                      }}
                    >
                      Number of Cards - {num}
                    </Typography>
                  </CardContent>
                </Card>
                <div
                  style={{
                    margin: "auto",
                    width: "70%",
                  }}
                >
                  <Card style={{ borderRight: "3px solid #3f51b5" }}>
                    <div style={{ background: "#3f51b5", color: "white" }}>
                      <Typography
                        variant="h5"
                        style={{ paddingLeft: "15px", paddingBottom: "5px" }}
                        align="center"
                      >
                        Notifications
                      </Typography>
                      <hr />
                    </div>
                    {notify_list.length !== 0 ? (
                      <div
                        style={{
                          margin: "auto",
                          marginLeft: "15%",
                          overflow: "auto",
                          height: "120px",
                          marginTop: "15px",
                        }}
                      >
                        <NotificationList notification={notify_list} />
                      </div>
                    ) : (
                      <div align="center" style={{ marginBottom: "40px" }}>
                        <Typography>No Notifications to Show</Typography>
                      </div>
                    )}
                  </Card>
                </div>
              </Grid>
            </Grow>
          </Grid>
        </Paper>
      </div>
    );
  } else {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Card />
      </div>
    );
  }
}

function searchingFor(term, type) {
  return function (x) {
    return x[type].toLowerCase().includes(term.toLowerCase()) || !term;
  };
}

//variable name must be same when passing props to the nested component and mapping stateProps
const mapStateToProps = (state) => {
  return {
    profiles: state.firestore.ordered.user, // get the  list of user from the
    auth: state.firebase.auth,
    current_user: state.firebase.profile,
    notification: state.firestore.ordered.notify,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: "user" },
    { collection: "notify", orderBy: ["time", "desc"] },
  ])
)(Dashboard);
