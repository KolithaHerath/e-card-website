import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createProfile } from "../../store/actions/profileAction";
import { Redirect } from "react-router-dom";
import firebase from "firebase";
import "firebase/storage";
import { makeStyles } from "@material-ui/core/styles";
import * as validator from "../auth/Validation";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {
  Button,
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
  Grid,
  Avatar,
} from "@material-ui/core";

function CreateProfile(props) {
  const initState = {
    fN: "",
    lN: "",
    cmp: "",
    adr: "",
    pNo: 0,
    wNo: 0,
    pos: "",
    eM: "",
    conn: [],
    pPic: "",
    front: "",
    back: "",
    status: false,
    errors: {
      fN: "",
      lN: "",
      cmp: "",
      adr: "",
      pNo: "",
      wNo: "",
      pos: "",
      eM: "",
    },
  };

  const [valid, setValid] = useState(true);

  const [open, setOpen] = React.useState(false);

  //opening popup Dialog
  const handleClickOpen = (e) => {
    setOpen(true);
  };

  //closing popup Dialog
  const handleClose = () => {
    setOpen(false);
  };

  const [snackbar, setSnackbar] = useState(false);

  //opening snackbar
  const handleClick = () => {
    setSnackbar(true);
  };

  //closing snackbar
  const closeSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar(false);
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [doc, setDoc] = useState(initState);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("create"));
    if (profile) {
      setDoc({
        ...doc,
        fN: "",
        lN: "",
        cmp: "",
        adr: "",
        pNo: 0,
        wNo: 0,
        pos: "",
        eM: "",
        pPic: "",
        conn: [],
        front: "",
        back: "",
        status: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.removeItem("create");
    localStorage.setItem("create", JSON.stringify(props.profile));
  });

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

  const validateInputAndSetState = (id, value) => {
    const errors = validator.validate(id, value, doc.errors);
    setDoc({ ...doc, errors, [id]: value });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    validateInputAndSetState(id, value);
    setValid(validator.isErrorObjectEmpty(doc.errors)); //if the error state is empty then valid become true
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

    handleClose();
    if (isFormValid) {
      handleClick();
      setValid(true); // set the valid state to true since the form is valid
      delete doc.errors; // delete error state from the final object.
      props.createProfile(doc);
      props.history.push("/");
    } else {
      setValid(false);
    }
  };

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
        message="Your profile has been Created."
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
  //set the image selected for profile picture of the user
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDoc({
        ...doc,
        pPic: URL.createObjectURL(event.target.files[0]),
      });
    }
  };
  //set the image selected for front view of the card

  const frontView = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDoc({
        ...doc,
        front: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  //set the image selected for back view of the card
  const backView = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDoc({
        ...doc,
        back: URL.createObjectURL(event.target.files[0]),
      });
    }
  };
  let id = props.auth.uid;
  const ref = firebase.storage().ref(`${id}`);

  //Upload Front view image of the card onClick
  const frontUpload = (e) => {
    const file = document.getElementById("front").files[0];
    try {
      const name = new Date() + "-" + file.name;
      const metadata = {
        contentType: file.type,
      };
      const task = ref.child(name).put(file, metadata);
      task
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          setDoc({
            ...doc,
            front: url,
          });
        })
        .catch(console.error);
    } catch (err) {
      console.log(0);
    }
  };
  //Upload Back view image of the card onClick
  const backUpload = (e) => {
    const file = document.getElementById("back").files[0];
    try {
      const name = new Date() + "-" + file.name;
      const metadata = {
        contentType: file.type,
      };
      const task = ref.child(name).put(file, metadata);
      task
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          setDoc({
            ...doc,
            back: url,
          });
        })
        .catch(console.error);
    } catch (err) {
      console.log(0);
    }
  };
  //Upload profile picture of the user onClick

  const pPicUpload = (e) => {
    const file = document.getElementById("pPic").files[0];
    try {
      const name = new Date() + "-" + file.name;
      const metadata = {
        contentType: file.type,
      };
      const task = ref.child(name).put(file, metadata);
      task
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((url) => {
          setDoc({
            ...doc,
            pPic: url,
          });
        })
        .catch(console.error);
    } catch (err) {
      console.log(0);
    }
  };

  function handleDialog() {
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title" color="black">
          {"Create Profile"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            By clicking yse you will create your profile in the E-Card System.
            You will be redirected to your account after clicking "Yes". If
            there are any changes to be done click "No".
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
    );
  }

  const { auth } = props;
  const classes = useStyles();
  if (!auth.uid) return <Redirect to="/login" />;
  if (!auth.emailVerified) return <Redirect to="/verify" />;
  return (
    <form style={{ margin: "auto", width: "80%", padding: "10px" }}>
      {snackbar ? handleSnackBar() : null}
      <Card style={{ width: "auto" }}>
        <Typography variant="h4" style={{ padding: "10px" }}>
          Profile
        </Typography>
        <hr />
        <Grid container spcing={1}>
          <Grid item xs={6}>
            <CardContent>
              <div style={{ position: "relative" }} align="center">
                <Avatar
                  className={classes.large}
                  alt={doc.fN}
                  src={
                    doc.pPic ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  style={{ margin: "10px" }}
                />
                <div style={{ margin: "10px" }}>
                  <div>
                    <input
                      id="pPic"
                      onChange={onImageChange}
                      style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                      accept="image/*"
                      className={classes.input}
                      multiple
                      type="file"
                    />
                    <label htmlFor="pPic">
                      <Button
                        component="span"
                        variant="contained"
                        color="primary"
                        style={{ margin: "10px" }}
                      >
                        Select
                      </Button>
                    </label>
                    <Button
                      component="span"
                      onClick={pPicUpload}
                      variant="contained"
                      color="primary"
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
              <div style={{ clear: "left", position: "relative" }}>
                <Typography variant="h5">
                  Personal Information <hr />
                </Typography>
                <div>
                  {/* Material UI built in error message is used in this textfield */}
                  {/* vlaid is a state object that returns true or false on validation*/}
                  <TextField
                    error={doc.errors.fN === "" ? false : true}
                    className={classes.tField}
                    id="fN"
                    label="First Name"
                    value={doc.fN}
                    helperText={valid ? null : doc.errors.fN}
                    onChange={handleChange}
                    variant="outlined"
                  />
                  <TextField
                    error={doc.errors.lN === "" ? false : true}
                    className={classes.tField}
                    id="lN"
                    label="Last Name"
                    value={doc.lN}
                    helperText={valid ? null : doc.errors.lN}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </div>
                <div style={{ clear: "left" }}>
                  <TextField
                    error={doc.errors.pNo === "" ? false : true}
                    className={classes.tField}
                    id="pNo"
                    label="Personal Number"
                    value={doc.pNo}
                    helperText={valid ? null : doc.errors.pNo}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </div>
                <div>
                  <TextField
                    error={doc.errors.eM === "" ? false : true}
                    className={classes.tField}
                    id="eM"
                    label="E-Mail"
                    value={doc.eM}
                    helperText={valid ? null : doc.errors.eM}
                    onChange={handleChange}
                    variant="outlined"
                    style={{ width: "91%" }}
                  />
                </div>
              </div>
              <div>
                <Typography variant="h5" style={{ padding: "10px" }}>
                  Work Information
                  <hr />
                </Typography>
                <div>
                  <TextField
                    error={doc.errors.cmp === "" ? false : true}
                    className={classes.tField}
                    id="cmp"
                    label="Company"
                    value={doc.cmp}
                    helperText={valid ? null : doc.errors.cmp}
                    onChange={handleChange}
                    variant="outlined"
                  />
                  <TextField
                    error={doc.errors.pos === "" ? false : true}
                    className={classes.tField}
                    id="pos"
                    label="Position"
                    value={doc.pos}
                    helperText={valid ? null : doc.errors.pos}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </div>

                <div>
                  <TextField
                    error={doc.errors.wNo === "" ? false : true}
                    className={classes.tField}
                    id="wNo"
                    label="Work Phone Number"
                    value={doc.wNo}
                    helperText={valid ? null : doc.errors.wNo}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </div>
                <div>
                  <TextField
                    error={doc.errors.adr === "" ? false : true}
                    className={classes.tField}
                    id="adr"
                    label="Address"
                    value={doc.adr}
                    helperText={valid ? null : doc.errors.adr}
                    onChange={handleChange}
                    variant="outlined"
                    style={{ width: "91%" }}
                  />
                </div>
              </div>
            </CardContent>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" style={{ padding: "10px" }} align="center">
              Card Images
            </Typography>
            <div
              align="center"
              style={{
                paddingTop: "15px",
                margin: "auto",
                width: "65%",
              }}
            >
              <Card>
                <div style={{ position: "relative", margin: "5px" }}>
                  <Typography variant="body1">Front View</Typography>
                  <img
                    src={
                      doc.front ||
                      "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                    height="200"
                    width="320"
                    alt="Card Front View"
                  />
                  <div
                    style={{
                      clear: "right",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <input
                        id="front"
                        onChange={frontView}
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                        accept="image/*"
                        className={classes.input}
                        multiple
                        type="file"
                      />
                      <label htmlFor="front">
                        <Button
                          component="span"
                          variant="contained"
                          color="primary"
                          style={{ margin: "10px" }}
                        >
                          Select
                        </Button>
                      </label>
                      <Button
                        component="span"
                        onClick={frontUpload}
                        variant="contained"
                        color="primary"
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    margin: "5px",
                    clear: "right",
                  }}
                >
                  <Typography variant="body1">Back View</Typography>
                  <img
                    src={
                      doc.back ||
                      "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                    height="200"
                    width="320"
                    alt="Card Back View"
                  />
                  <div
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    <div>
                      <input
                        id="back"
                        onChange={backView}
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                        accept="image/*"
                        className={classes.input}
                        multiple
                        type="file"
                      />
                      <label htmlFor="back">
                        <Button
                          component="span"
                          variant="contained"
                          color="primary"
                          style={{ margin: "10px" }}
                        >
                          Select
                        </Button>
                      </label>
                      <Button
                        component="span"
                        onClick={backUpload}
                        variant="contained"
                        color="primary"
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <div
              style={{
                clear: "left",
                float: "right",
                position: "relative",
                marginRight: "80px",
                width: "300px",
                marginTop: "50px",
              }}
            >
              <Typography variant="body1">
                <b>Note</b>: You need to upload each images individually by
                clicking on the "UPLOAD" Button under the images.
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div align="center">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: 10 }}
              onClick={(e) => handleClickOpen()}
            >
              Update
            </Button>
            {open ? handleDialog() : null}
          </div>
          <div style={{ clear: "right" }}></div>
        </Grid>
      </Card>
    </form>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createProfile: (profile) => dispatch(createProfile(profile)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProfile);
