export const createProfile = (profile) => {
  return (dispatch, getState, { firebase }) => {
    //make async call to database
    profile["pNo"] = parseInt(profile.pNo);
    profile["wNo"] = parseInt(profile.wNo);
    const firestore = firebase.firestore();
    const id = getState().firebase.auth.uid.toString();
    firestore
      .collection("user")
      .doc(id)
      .update({
        // fields and values to be added in the database
        ...profile,
      })
      .then(() => {
        dispatch({ type: "CREATE_PROFILE", profile });
      })
      .catch((e) => {
        dispatch({ type: "CREATE_PROFILE_ERROR", e });
      });
  };
};

export const updateProfile = (profile) => {
  return (dispatch, getState, { firebase }) => {
    //make async call to database
    profile["pNo"] = parseInt(profile.pNo);
    profile["wNo"] = parseInt(profile.wNo);
    const firestore = firebase.firestore();
    const id = getState().firebase.auth.uid.toString();
    firestore
      .collection("user")
      .doc(id)
      .update({
        // fields and values to be added in the database
        ...profile,
      })
      .then(() => {
        dispatch({ type: "UPDATE_PROFILE", profile });
      })
      .catch((e) => {
        dispatch({ type: "UPDATE_PROFILE_ERROR", e });
      });
  };
};

export const updateEmail = (credentials) => {
  return (dispatch, getState, { firebase }) => {
    const mail = getState().firebase.auth.email.toString();
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      mail,
      credentials.password
    );

    user
      .reauthenticateWithCredential(credential)
      .then(function (userCredential) {
        userCredential.user
          .updateEmail(credentials.email)
          .then(() => {
            dispatch({ type: "UPDATE_PROFILE" });
          })
          .catch((e) => {
            dispatch({ type: "UPDATE_PROFILE_ERROR", e });
          });
      });
  };
};

export const changePwd = (credentials) => {
  return (dispatch, getState, { firebase }) => {
    const mail = getState().firebase.auth.email.toString();
    const user = firebase.auth().currentUser;

    const credential = firebase.auth.EmailAuthProvider.credential(
      mail,
      credentials.currPwd
    );

    user
      .reauthenticateWithCredential(credential)
      .then(function (userCredential) {
        userCredential.user
          .updatePassword(credentials.password)
          .then(() => {
            dispatch({ type: "UPDATE_PROFILE" });
          })
          .catch((e) => {
            dispatch({ type: "UPDATE_PROFILE_ERROR", e });
          });
      });
  };
};

export const deleteConnection = (uid, id) => {
  return (dispatch, getState, { firebase }) => {
    const firestore = firebase.firestore();
    firestore
      .collection("user")
      .doc(uid)
      .update({
        conn: firebase.firestore.FieldValue.arrayRemove(id),
      })
      .then(() => {
        dispatch({ type: "DELETE_PROFILE" });
      })
      .catch((e) => {
        dispatch({ type: "DELETE_PROFILE_ERROR", e });
      });
  };
};
