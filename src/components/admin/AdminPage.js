import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Grow from "@material-ui/core/Grow";
import { makeStyles } from "@material-ui/core/styles";
import GridView from "../admin/GridView";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  circlular: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

function Admin(props) {
  // Declare a new state variable, which we'll call "count"

  const classes = useStyles();

  const { profiles, auth, current_user } = props;

  localStorage.removeItem("profile");
  localStorage.removeItem("create");

  if (!auth.uid) return <Redirect to="/login" />;
  // check if the email is verified or not
  if (!auth.emailVerified) return <Redirect to="/verify" />;

  if (current_user.isLoaded && current_user.isEmpty)
    return <Redirect to="/create" />;

  if (current_user.isLoaded && !current_user.status) return <Redirect to="/" />;
  const conn_list = [];
  profiles &&
    profiles.map((user) => {
      return conn_list.push(user);
    });

  const checked = true;
  if (profiles !== undefined && conn_list.length === profiles.length) {
    return (
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grow
            in={checked}
            style={{ transformOrigin: "0 0 0" }}
            {...(checked ? { timeout: 1000 } : {})}
          >
            <Grid item xs={12}>
              <div style={{ width: "80%", margin: "auto" }}>
                <GridView profiles={conn_list} />
              </div>
            </Grid>
          </Grow>
        </Grid>
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

const mapStateToProps = (state) => {
  return {
    profiles: state.firestore.ordered.user, // get the  list of user from the firestore
    auth: state.firebase.auth,
    current_user: state.firebase.profile,
  };
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "user" }])
)(Admin);
