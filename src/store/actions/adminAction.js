export const updateProfile = (profile) => {
  return (dispatch, getState, { firebase }) => {
    //make asyn call to database
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

export const updateConnection = (profile, uid) => {
  return (dispatch, getState, { firebase }) => {
    //make asyn call to database
    const firestore = firebase.firestore();
    profile["pNo"] = parseInt(profile.pNo);
    profile["wNo"] = parseInt(profile.wNo);
    firestore
      .collection("user")
      .doc(uid)
      .update({
        // fields and values to be updated in the database
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

export const deleteUser = (uid) => {
  return (dispatch, getState, { firebase }) => {
    const firestore = firebase.firestore();
    const storage = firebase.storage().ref(uid);
    const user = firebase.auth().currentUser;
    firestore
      .collection("user")
      .doc(uid)
      .delete()
      .catch((e) => {
        dispatch({ type: "DELETE_PROFILE_ERROR", e });
      });
    storage
      .listAll()
      .then(function (result) {
        result.items.forEach(function (file) {
          file.delete();
        });
      })
      .catch(function (error) {
        dispatch({ type: "DELETE_PROFILE_ERROR", error });
      });
    user
      .delete()
      .then(function () {
        dispatch({ type: "DELETE_PROFILE" });
      })
      .catch(function (error) {
        // An error happened.
        dispatch({ type: "DELETE_PROFILE_ERROR", error });
      });
  };
};

export const uploadNews = (obj) => {
  return (dispatch, getState, { firebase }) => {
    const firestore = firebase.firestore();

    firestore
      .collection("news")
      .doc("msg")
      .update({
        ...obj,
      });
  };
};

export const updateContact = (obj) => {
  return (dispatch, getState, { firebase }) => {
    const firestore = firebase.firestore();
    firestore
      .collection("news")
      .doc("msg")
      .update({
        ...obj,
      });
  };
};
