import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "../../store/actions/authAction";
import * as validator from "./Validation";
import {
  Button,
  Container,
  Typography,
  TextField,
  CardContent,
  Card,
} from "@material-ui/core";

function Register(props) {
  const initState = {
    eM: "",
    pwd: "",
    repwd: "",
    errors: {
      pwd: "",
      eM: "",
      repwd: "",
    },
  };

  const [state, setState] = useState(initState);
  const validateInputAndSetState = (id, value) => {
    const errors = validator.validate(id, value, state.errors);
    setState({ ...state, errors, [id]: value });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    validateInputAndSetState(id, value);
    setState({ ...state, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // iterate through the component state as key value pairs and
    //  run the validation on each value.
    // if the validation function handles that key value pair
    //  then it is validated otherwise skipped
    for (let [id, value] of Object.entries(state)) {
      validateInputAndSetState(id, value);
    }

    // if error object is empty then the form is valid
    const isFormValid = validator.isErrorObjectEmpty(state.errors);
    // submit if the form is valid
    if (isFormValid && state.repwd === state.pwd) {
      props.register(state);
      props.history.push(state, "/verify"); // After the registration is completed, create page will be loaded.
    } else {
    }
  };
  const { auth, authError } = props;
  if (auth.uid) return <Redirect to="/create" />;
  return (
    <Container component="main" maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardContent>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <hr />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              required
              id="eM"
              label="Email"
              name="email"
              autoComplete="email"
              onChange={handleChange}
            />
            <Typography color="secondary">{state.errors.eM}</Typography>
            <br />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              required
              name="password"
              label="Password"
              type="password"
              id="pwd"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Typography color="secondary">{state.errors.pwd}</Typography>
            <br />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              required
              name="password"
              label="Re-Enter Password"
              type="password"
              id="repwd"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Typography color="secondary">{state.errors.repwd}</Typography>
            <br />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>

            <div>
              <Typography variant="body1" color="secondary">
                {authError ? <p> {authError} </p> : null}
                {state.repwd === state.pwd ? null : (
                  <p>Re-entered Password must be same as the Password!.</p>
                )}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </form>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (newUser) => dispatch(register(newUser)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
