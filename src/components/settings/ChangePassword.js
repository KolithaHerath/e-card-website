import React, { useState } from "react";
import { connect } from "react-redux";
import { changePwd } from "../../store/actions/profileAction";
import { Redirect } from "react-router-dom";
import * as validator from "../auth/Validation";
import { logout } from "../../store/actions/authAction";
import {
  Button,
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ChangePWd(props) {
  const initState = {
    password: "",
    pwd: "",
    repwd: "",
    errors: {
      password: "",
      pwd: "",
      repwd: "",
    },
  };
  const [doc, setDoc] = useState(initState);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputAndSetState = (id, value) => {
    const errors = validator.validate(id, value, doc.errors);
    setDoc({ errors, [id]: value });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    validateInputAndSetState(id, value);
    setDoc({ ...doc, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // iterate through the component state as key value pairs and
    //  run the validation on each value.
    // if the validation function handles that key value pair
    //  then it is validated otherwise skipped
    for (let [id, value] of Object.entries(doc)) {
      validateInputAndSetState(id, value);
    }

    // if error object is empty then the form is valid
    const isFormValid = validator.isErrorObjectEmpty(doc.errors);
    // submit if the form is valid

    if (isFormValid && (doc.pwd === doc.repwd) & (doc.pwd !== doc.password)) {
      props.changePwd(doc);
      props.logout();
    } else {
    }
  };
  const { authError, auth } = props;
  if (!auth.uid) return <Redirect to="/login" />;
  return (
    <Container component="main" maxWidth="xs">
      <form>
        <Card>
          <CardContent style={{ margin: "10px" }}>
            <Typography component="h1" variant="h5">
              Change Current Password
            </Typography>
            <hr />
            <br />
            <Typography variant="body1">
              Type in the new password below
            </Typography>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              required
              name="newPassword"
              label="New Password"
              type="password"
              id="pwd"
              autoComplete="current-password"
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
            <Typography color="secondary" variant="caption">
              {doc.errors.pwd}
            </Typography>
            <Typography variant="body1">Re-enter your new password</Typography>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              required
              name="RePwd"
              label="Re-enter Password"
              type="password"
              id="repwd"
              autoComplete="current-password"
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
            <Typography color="secondary" variant="caption">
              {doc.errors.repwd}
            </Typography>
            <br />
            <br />

            <Typography variant="body1">
              Type in your current password
            </Typography>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              required
              name="password"
              label="Current Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
            <Typography color="secondary" variant="caption">
              {doc.errors.password}
            </Typography>
            <br />
            <br />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Submit
            </Button>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"New Password"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  By clicking yes your current password will be changed. You
                  will be signed out and will require you to login using the
                  password.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  No
                </Button>
                <Button onClick={handleSubmit} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
            <div>
              <Typography variant="body2" color="secondary">
                {authError ? <p>{authError}</p> : null}
              </Typography>
            </div>
            <br />
          </CardContent>
        </Card>
      </form>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePwd: (creds) => dispatch(changePwd(creds)),
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePWd);
