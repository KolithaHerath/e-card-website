const initState = {
  authError: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_FAILED":
      return {
        ...state,
        authError: "Invalid Email or Password!",
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        authError: null,
      };
    case "LOGOUT_SUCCESS":
      return state;
    case "REGISTER_SUCCESS":
      return {
        ...state,
        regError: null,
      };
    case "REGISTER_ERROR":
      return {
        ...state,
        regError: action.err.message,
      };
    default:
      return state;
  }
};

export default authReducer;
