import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { updateConnection } from "../../store/actions/adminAction";
import { deleteUser } from "../../store/actions/adminAction";
import { deleteConnection } from "../../store/actions/profileAction";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import * as validator from "../auth/Validation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//Initiate state when the page loads
function ViewConnection(props) {
  const initState = {
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

  // Used for the state of the dialog
  //if the user deletes or updates a profile the dialog popup will be triggered
  const [open, setOpen] = React.useState(false);
  const [valid, setValid] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [doc, setDoc] = useState(initState);

  //Snackbar when the user profile is updated
  const [snackbarUpdate, setSnackbarUpdate] = useState(false);

  const handleClickUpdate = () => {
    setSnackbarUpdate(true);
  };

  const closeSnackbarUpdate = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarUpdate(false);
  };

  // Snackbar when a user is deleted
  const [snackbarDelete, setsnackbarDelete] = useState(false);

  const handleClickDelete = () => {
    setsnackbarDelete(true);
  };

  const closeSnackbarDelete = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setsnackbarDelete(false);
  };

  // Using persisted state for the component
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    if (profile) {
      setDoc({
        ...doc,
        fN: profile.fN || "",
        lN: profile.lN || "",
        cmp: profile.cmp || "",
        adr: profile.adr || "",
        pNo: profile.pNo || 0,
        wNo: profile.wNo || 0,
        pos: profile.pos || "",
        eM: profile.eM || "",
        conn: profile.conn || [],
        pPic: profile.pPic || "",
        front: profile.front || "",
        back: profile.back || "",
        status: profile.status || false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(props.conn_profile));
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
  }));

  const validateInputAndSetState = (id, value) => {
    const errors = validator.validate(id, value, doc.errors);
    if (id === "pNo" || id === "wNo") {
      setDoc({ ...doc, errors, [id]: parseInt(value) });
    }
    setDoc({ ...doc, errors, [id]: value });
  };

  //Returns Snackbar when Updating a user from the profile through admin access
  const handleUpdateSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarUpdate}
        autoHideDuration={4000}
        onClose={closeSnackbarUpdate}
        message="Profile Updated"
        action={
          <React.Fragment>
            {doc.fN} {doc.lN}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeSnackbarUpdate}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    );
  };

  //Returns Snackbar when deleteing a user from the table
  const handleDeleteSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarDelete}
        autoHideDuration={4000}
        onClose={closeSnackbarDelete}
        message="The profile is Deleted from the list."
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeSnackbarDelete}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    validateInputAndSetState(id, value);
    setValid(validator.isErrorObjectEmpty(doc.errors)); //if the error state is empty then valid become true
    // setDoc({ ...doc, [e.target.id]: e.target.value });
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
      handleClickUpdate();
      setValid(true); // set the valid state to true since the form is valid
      delete doc.errors; // delete error state from the final object.
      var uid = props.match.params.id;
      props.updateConnection(doc, uid);
    } else {
      setValid(false);
    }
  };

  const onDelete = (status) => {
    handleClose();
    handleClickDelete();
    var uid = props.match.params.id;
    if (status) {
      // if the user is an admin it will delete the profile from the system
      props.deleteUser(uid);
      props.history.goBack();
    } else {
      // if the user is normal user it will remove the connectin list from their list.
      props.deleteConnection(uid, props.admin_profile.id);
      props.history.goBack();
    }
  };

  const { admin_profile, auth } = props;
  const classes = useStyles();
  let admin = admin_profile.status;

  // checks if the user has logged out or not
  if (!auth.uid) return <Redirect to="/" />;
  // check if the email is verified or not
  if (!auth.emailVerified) return <Redirect to="/verify" />;
  // Check if the logged in user is an admin or not
  if (admin_profile.isEmpty) {
    admin = true;
  }
  return (
    <form style={{ margin: "auto", width: "80%", padding: "10px" }}>
      {snackbarUpdate ? handleUpdateSnackBar() : null}
      {snackbarDelete ? handleDeleteSnackBar() : null}
      <Card style={{ width: "auto" }}>
        <Typography variant="h4" style={{ padding: "10px" }}>
          Profile
        </Typography>
        <hr />
        <Grid container spcing={1}>
          <Grid item xs={6}>
            <CardContent>
              <div style={{ marginBottom: "10px" }}>
                <Avatar
                  className={classes.large}
                  alt={doc.fN}
                  src={
                    doc.pPic ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  style={{ margin: "auto", border: "2.5px solid #3f51b5" }}
                />
              </div>
              <div style={{ marginLeft: "20px" }}>
                <Typography variant="h5">
                  Personal Information <hr />
                </Typography>
                <Paper
                  elevation={3}
                  style={{
                    borderRight: "3px solid #3f51b5",
                  }}
                >
                  <div>
                    {admin ? (
                      <div style={{ paddingTop: "15px" }}>
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
                    ) : (
                      <div>
                        <Typography variant="body1" style={{ padding: "10px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            First Name -{" "}
                          </label>
                          {doc.fN}
                        </Typography>
                        <Typography variant="body1" style={{ padding: "10px" }}>
                          <label style={{ fontWeight: "bold" }}>
                            {" "}
                            Last Name -{" "}
                          </label>
                          {doc.lN}
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div>
                    {admin ? (
                      <div>
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
                    ) : (
                      <Typography variant="body1" style={{ padding: "10px" }}>
                        <label style={{ fontWeight: "bold" }}>
                          Personal Number -{" "}
                        </label>
                        {doc.pNo}
                      </Typography>
                    )}
                  </div>

                  <div>
                    {admin ? (
                      <TextField
                        error={doc.errors.eM === "" ? false : true}
                        className={classes.tField}
                        id="eM"
                        label="E-Mail"
                        value={doc.eM}
                        helperText={valid ? null : doc.errors.eM}
                        onChange={handleChange}
                        variant="outlined"
                        style={{ width: "95%" }}
                      />
                    ) : (
                      <Typography variant="body1" style={{ padding: "10px" }}>
                        <label style={{ fontWeight: "bold" }}>E-Mail - </label>
                        {doc.eM}
                      </Typography>
                    )}
                  </div>
                </Paper>
                <Typography variant="h5" style={{ marginTop: "10px" }}>
                  Work Information <hr />
                </Typography>
                <Paper
                  elevation={3}
                  style={{
                    borderRight: "3px solid #3f51b5",
                  }}
                >
                  {admin ? (
                    <div style={{ paddingTop: "15px" }}>
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
                  ) : (
                    <Typography variant="body1" style={{ padding: "10px" }}>
                      <label style={{ fontWeight: "bold" }}>Company - </label>
                      {doc.cmp}

                      <label style={{ fontWeight: "bold", marginLeft: "15px" }}>
                        {" "}
                        Position -{" "}
                      </label>
                      {doc.pos}
                    </Typography>
                  )}
                  {admin ? (
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
                  ) : (
                    <Typography
                      id="adr"
                      variant="body1"
                      style={{ padding: "10px" }}
                    >
                      <label style={{ fontWeight: "bold" }}>
                        Work Number -{" "}
                      </label>
                      {doc.wNo}
                    </Typography>
                  )}
                  <div>
                    {admin ? (
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
                          style={{ width: "95%" }}
                        />
                      </div>
                    ) : (
                      <Typography
                        id="adr"
                        variant="body1"
                        style={{ padding: "10px" }}
                      >
                        <label style={{ fontWeight: "bold" }}>
                          {" "}
                          Address -{" "}
                        </label>
                        {doc.adr}
                      </Typography>
                    )}
                  </div>
                </Paper>
              </div>
            </CardContent>
          </Grid>
          <Grid item xs={6}>
            <div style={{ margin: "50px" }}>
              <div align="center">
                <Typography variant="h6" style={{ padding: "10px" }}>
                  Card Images
                </Typography>
              </div>
              <div align="center">
                <Paper elevation={3} style={{ width: "75%", padding: "10xp" }}>
                  <Typography variant="body1">Front View</Typography>
                  <img
                    src={
                      doc.front ||
                      "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                    height="200"
                    width="320"
                    alt="Card Front View"
                    style={{ border: "2.5px solid #3f51b5" }}
                  />
                </Paper>
                <Paper elevation={3} style={{ width: "75%", padding: "10xp" }}>
                  <Typography variant="body1">Back View</Typography>

                  <img
                    src={
                      doc.back ||
                      "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                    height="200"
                    width="320"
                    alt="Card Front View"
                    style={{ border: "2.5px solid #3f51b5" }}
                  />
                </Paper>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div align="center" style={{ margin: "10px" }}>
            {admin ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ margin: "5px" }}
              >
                Update
              </Button>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              style={{ margin: "5px" }}
            >
              Delete
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
                {"Delete Connection"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Are you sure that you want to delete {doc.fN} {doc.lN} from
                  your list of connection?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  No
                </Button>
                <Button onClick={(e) => onDelete(admin)} color="primary">
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      </Card>
    </form>
  );
}

const mapStateToProps = (state, ownProps) => {
  //for id receive from selecting an item from the list
  const id = ownProps.match.params.id;
  const profiles = state.firestore.data.user; // check with the id values of the documents in the firestore
  var profile = profiles ? profiles[id] : null; // and when the value has a match pass that document as an object
  if (profile !== null && profile !== undefined) {
    localStorage.setItem("profile", JSON.stringify(profile));
  }
  if (profile === null) {
    profile = JSON.parse(localStorage.getItem("profile"));
  }
  return {
    conn_profile: profile,
    auth: state.firebase.auth,
    admin_profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnection: (profile, id) => dispatch(updateConnection(profile, id)),
    deleteConnection: (uid, id) => dispatch(deleteConnection(uid, id)),
    deleteUser: (uid) => dispatch(deleteUser(uid)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "user" }])
)(ViewConnection);
