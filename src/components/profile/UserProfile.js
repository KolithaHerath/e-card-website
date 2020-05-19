import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import firebase from "firebase";
import { updateProfile } from "../../store/actions/adminAction";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function UserProfile(props) {
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
    front: "",
    back: "",
    status: false,
  };

  const [doc, setDoc] = useState(initState);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("current_user_profile"));
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
        pPic: profile.pPic || "",
        front: profile.front || "",
        back: profile.back || "",
        conn: profile.conn || [],
        status: profile.status || false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("current_user_profile", JSON.stringify(props.profile));
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

  const handleChange = (e) => {
    setDoc({ ...doc, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(doc);
    // props.updateProfile(doc);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDoc({ ...doc, pPic: URL.createObjectURL(event.target.files[0]) });
    }
  };

  const backView = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDoc({ ...doc, back: URL.createObjectURL(event.target.files[0]) });
    }
  };

  const frontView = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDoc({ ...doc, front: URL.createObjectURL(event.target.files[0]) });
    }
  };

  const ref = firebase.storage().ref();

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
          console.log("DONE");
        })
        .catch(console.error);
    } catch (err) {
      console.log(0);
    }
  };
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
          console.log("DONE");
        })
        .catch(console.error);
    } catch (err) {
      console.log(0);
    }
  };

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
          console.log("DONE");
        })
        .catch(console.error);
    } catch (err) {
      console.log(0);
    }
  };

  function renderProfile() {
    return (
      <form style={{ margin: "auto", width: "80%", padding: "10px" }}>
        <Card style={{ width: "auto" }}>
          <Grid container spcing={1}>
            <Grid item xs={6}>
              <Typography variant="h4" style={{ padding: "10px" }}>
                Profile
              </Typography>
              <div style={{ position: "relative" }}>
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
              <div>
                <div style={{ clear: "left", position: "relative" }}>
                  <div>
                    <TextField
                      className={classes.tField}
                      id="fN"
                      label="First Name"
                      value={doc.fN}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.tField}
                      id="lN"
                      label="Last Name"
                      value={doc.lN}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </div>
                  <div>
                    <TextField
                      className={classes.tField}
                      id="cmp"
                      label="Company"
                      value={doc.cmp}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.tField}
                      id="pos"
                      label="Position"
                      value={doc.pos}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </div>
                  <div>
                    <TextField
                      className={classes.tField}
                      id="eM"
                      label="E-Mail"
                      value={doc.eM}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.tField}
                      id="pNo"
                      label="Personal Number"
                      value={doc.pNo}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </div>
                  <div>
                    <TextField
                      className={classes.tField}
                      id="wNo"
                      label="Work Number"
                      value={doc.wNo}
                      onChange={handleChange}
                      variant="outlined"
                    />
                    <TextField
                      className={classes.tField}
                      id="adr"
                      label="Address"
                      value={doc.adr}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </div>
                </div>
              </div>
            </Grid>
            <Grid>
              <Typography variant="h6" style={{ padding: "10px" }}>
                Card Images
              </Typography>
              <div
                className="CenterImage"
                style={{
                  paddingTop: "15px",
                  margin: "auto",
                  width: "50%",
                }}
              >
                <div style={{ position: "relative", margin: "5px" }}>
                  <img
                    src={
                      doc.front ||
                      "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                    height="160"
                    width="250"
                    alt="Card Front View"
                  />
                  <div
                    align="right"
                    style={{
                      clear: "right",
                      float: "right",
                      marginLeft: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <input
                        id="front"
                        onChange={frontView}
                        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
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
                  <img
                    src={
                      doc.back ||
                      "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                    height="160"
                    width="250"
                    alt="Card Back View"
                  />
                  <div
                    style={{
                      float: "right",
                      marginLeft: "10px",
                    }}
                  >
                    <div>
                      <input
                        id="back"
                        onChange={backView}
                        style={{ whiteSpace: "normal", wordWrap: "break-word" }}
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
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <div style={{ float: "right" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: 10 }}
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
            <div style={{ clear: "right" }}></div>
          </Grid>
        </Card>
      </form>
    );
  }

  const { auth } = props;
  const classes = useStyles();
  if (!auth.uid) return <Redirect to="/login" />;

  const profileView = doc === null ? <Redirect to="/" /> : renderProfile();
  if (profileView) {
    return <div>{profileView}</div>;
  } else {
    return (
      <div className="container center">
        <p>Loading Profile...</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  //for id receive from selecting an item from the list
  var curr_user = state.firebase.profile;

  if (!curr_user.isEmpty) {
    localStorage.setItem("current_user_profile", JSON.stringify(curr_user));
  }
  if (curr_user.isEmpty) {
    curr_user = JSON.parse(localStorage.getItem("current_user_profile"));
  }

  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (profile) => dispatch(updateProfile(profile)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "user" }])
)(UserProfile);
