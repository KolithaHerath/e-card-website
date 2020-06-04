import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register, logout } from "../../store/actions/authAction";
import firebase from "firebase/app";
import "firebase/auth";
import {
  Button,
  Container,
  Typography,
  CardContent,
  Card,
} from "@material-ui/core";

function Register(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    var verifyUser = firebase.auth().currentUser;
    var actionCodeSettings = {
      // After password reset, the user will be give the ability to go back
      // to this page.
      url: "https://visiting-card-5b274.web.app/create",
      handleCodeInApp: false,
    };
    verifyUser
      .sendEmailVerification(actionCodeSettings)
      .then(function () {
        //Email User
        window.alert("Verification Sent");
      })
      .catch(function (error) {
        //errors
        window.alert("Error : " + error.message);
      });
  };

  const { auth } = props;
  if (!auth.uid) return <Redirect to="/login" />;
  var status = auth.emailVerified.toString();
  var user = auth.email.toString();
  if (auth.emailVerified) return <Redirect to="/create" />;
  return (
    <Container component="main" maxWidth="xs">
      <form>
        <Card>
          <CardContent>
            <Typography component="h1" variant="h5">
              Verification
            </Typography>
            <Typography variant="body1">Welcome User:{user}</Typography>
            <Typography variant="body1">Verified: {status}</Typography>
            <br />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={props.logout}
              to="/"
            >
              Logout
            </Button>
            <br />
            <br />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Send Verification
            </Button>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (newUser) => dispatch(register(newUser)),
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
