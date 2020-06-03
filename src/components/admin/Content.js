import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { uploadNews, updateContact } from "../../store/actions/adminAction";
import {
  Card,
  Typography,
  CardContent,
  TextField,
  Button,
  Grow,
  Snackbar,
} from "@material-ui/core";

import * as validator from "../auth/Validation";

function Content(props) {
  const { content } = props;
  const initState = {
    msg: "",
    date: "",
  };

  const initContact = {
    fN1: "",
    lN1: "",
    pNo1: 0,
    eM1: "",
    fN2: "",
    lN2: "",
    pNo2: 0,
    eM2: "",
    errors: {
      fN1: "",
      lN1: "",
      pNo1: "",
      eM1: "",
      fN2: "",
      lN2: "",
      pNo2: "",
      eM2: "",
    },
  };

  const [news, setNews] = useState(initState);

  const [valid, setValid] = useState(true);

  const [contact, setContact] = useState(initContact);

  const [snackbar, setSnackbar] = useState(false);

  const handleClick = () => {
    setSnackbar(true);
  };

  const closeSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar(false);
  };

  function setData() {
    content &&
      // eslint-disable-next-line array-callback-return
      content.map((item) => {
        setContact({
          ...contact,
          fN1: item.fN1 || "",
          lN1: item.lN1 || "",
          pNo1: item.pNo1 || 0,
          eM1: item.eM1 || "",
          fN2: item.fN2 || "",
          lN2: item.lN2 || "",
          pNo2: item.pNo2 || 0,
          eM2: item.eM2 || "",
        });
      });
  }
  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: "100%",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    tField: {
      padding: 10,
    },
    input: {
      display: "none",
    },
  }));

  const classes = useStyles();

  const validateInputAndSetState = (id, value) => {
    const errors = validator.validate(id, value, contact.errors);
    setContact({ ...contact, errors, [id]: value });
  };

  const handleContact = (e) => {
    const { id, value } = e.target;
    validateInputAndSetState(id, value);
    setValid(validator.isErrorObjectEmpty(contact.errors)); //if the error state is empty then valid become true
    // setDoc({ ...doc, [e.target.id]: e.target.value });
  };

  function handleChange(e) {
    setNews({ ...news, msg: e.target.value, date: new Date() });
  }

  function handleAnnouncement(e) {
    handleClick();
    props.uploadNews(news);
  }

  function handleContactUpdate(e) {
    for (let [id, value] of Object.entries(contact)) {
      validateInputAndSetState(id, value);
    }

    const isFormValid = validator.isErrorObjectEmpty(contact.errors);

    if (isFormValid) {
      handleClick();
      setValid(true); // set the valid state to true since the form is valid
      delete contact.errors; // delete error state from the final object.
      props.updateContact(contact);
    } else {
      setValid(false);
    }
  }

  //Returns Snackbar when Updating current user profile
  const handleSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbar}
        autoHideDuration={4000}
        onClose={closeSnackBar}
        message="Successfully Updated"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeSnackBar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    );
  };

  const { auth, current_user } = props;
  if (!auth.uid) return <Redirect to="/login" />;
  // check if the current user is an admin or not
  if (!current_user.status) return <Redirect to="/" />;
  const checked = true;
  return (
    <div style={{ width: "750px", margin: "auto", marginTop: "10px" }}>
      {snackbar ? handleSnackBar() : null}
      <Grow
        in={checked}
        style={{ transformOrigin: "0 0 0" }}
        {...(checked ? { timeout: 1000 } : {})}
      >
        <Card>
          <CardContent>
            <Typography variant="h5">
              Announcement <hr />
            </Typography>
            <div>
              <TextField
                id="news"
                label="Announcement to make..."
                multiline
                rows={3}
                variant="outlined"
                onChange={handleChange}
                style={{ width: "100%" }}
              />
            </div>
            <Button
              color="primary"
              variant="contained"
              onClick={handleAnnouncement}
              style={{ float: "right", margin: "10px" }}
            >
              Update
            </Button>
          </CardContent>
        </Card>
      </Grow>
      <Grow
        in={checked}
        style={{ transformOrigin: "0 0 0" }}
        {...(checked ? { timeout: 1000 } : {})}
      >
        <Card style={{ marginTop: "10px", marginBottom: "10px" }}>
          <CardContent>
            <Typography variant="h5">
              Update Contact Information <hr />
            </Typography>
            <div>
              <Typography
                variant="h6"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                For Mobile Application Contact Us
              </Typography>
              <div style={{ margin: "10px" }}>
                <TextField
                  error={contact.errors.fN1 === "" ? false : true}
                  className={classes.tField}
                  id="fN1"
                  label="First Name"
                  value={contact.fN1}
                  helperText={valid ? null : contact.errors.fN1}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  error={contact.errors.lN1 === "" ? false : true}
                  className={classes.tField}
                  id="lN1"
                  label="Last Name"
                  value={contact.lN1}
                  helperText={valid ? null : contact.errors.lN1}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
              </div>
              <div style={{ margin: "10px" }}>
                <TextField
                  error={contact.errors.pNo1 === "" ? false : true}
                  className={classes.tField}
                  id="pNo1"
                  label="Phone Number"
                  value={contact.pNo1}
                  helperText={valid ? null : contact.errors.pNo1}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />

                <TextField
                  error={contact.errors.eM1 === "" ? false : true}
                  className={classes.tField}
                  id="eM1"
                  label="E-Mail Address"
                  value={contact.eM1}
                  helperText={valid ? null : contact.errors.eM1}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
              </div>
            </div>
            <div>
              <Typography
                variant="h6"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                For Website Contact Us
              </Typography>
              <div style={{ margin: "10px" }}>
                <TextField
                  error={contact.errors.fN2 === "" ? false : true}
                  className={classes.tField}
                  id="fN2"
                  label="First Name"
                  value={contact.fN2}
                  helperText={valid ? null : contact.errors.fN2}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  error={contact.errors.lN2 === "" ? false : true}
                  className={classes.tField}
                  id="lN2"
                  label="Last Name"
                  value={contact.lN2}
                  helperText={valid ? null : contact.errors.lN2}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
              </div>
              <div style={{ margin: "10px" }}>
                <TextField
                  error={contact.errors.pNo2 === "" ? false : true}
                  className={classes.tField}
                  id="pNo2"
                  label="Phone Number"
                  value={contact.pNo2}
                  helperText={valid ? null : contact.errors.pNo2}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />

                <TextField
                  error={contact.errors.eM2 === "" ? false : true}
                  className={classes.tField}
                  id="eM2"
                  label="E-Mail Address"
                  value={contact.eM2}
                  helperText={valid ? null : contact.errors.eM2}
                  onChange={handleContact}
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
              </div>
            </div>
            <Button
              color="primary"
              variant="contained"
              style={{ float: "right", margin: "10px" }}
              onClick={handleContactUpdate}
            >
              Update
            </Button>
          </CardContent>
        </Card>
      </Grow>
    </div>
  );
}

const mapStateToProps = (state) => {
  var info = state.firestore.ordered.news;
  if (info !== undefined) {
    return {
      content: info, // get the  list of user from the firestore
      auth: state.firebase.auth,
      current_user: state.firebase.profile,
    };
  } else {
    return {
      content: undefined,
      auth: state.firebase.auth,
      current_user: state.firebase.profile,
    };
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadNews: (obj) => dispatch(uploadNews(obj)),
    updateContact: (obj) => dispatch(updateContact(obj)),
  };
};
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "news" }])
)(Content);
