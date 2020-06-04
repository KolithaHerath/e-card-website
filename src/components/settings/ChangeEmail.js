import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { updateEmail } from "../../store/actions/profileAction";
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

function ChangeEmail(props) {
  const initState = {
    email: "",
    password: "",
    errors: {
      email: "",
      password: "",
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
    // e.preventDefault();
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

    if (isFormValid) {
      props.updateEmail(doc);
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
              Change E-Mail Address
            </Typography>
            <hr />
            <Typography variant="body1">
              Type in the new Email address below
            </Typography>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              required
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <Typography color="secondary" variant="caption">
              {doc.errors.email}
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
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Typography color="secondary" variant="caption">
              {doc.errors.password}
            </Typography>
            <br />
            <br />

            <Button
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
                {"New E-mail Address"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  By clicking yes your current login email address will be
                  changed to new email address. You will be signed out and will
                  require you to login using the new email adress.
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
    updateEmail: (creds) => dispatch(updateEmail(creds)),
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
