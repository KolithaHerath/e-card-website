import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../../store/actions/authAction";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import HomeIcon from "@material-ui/icons/Home";

const LoggedInLink = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <ul>
      <li style={{ display: "inline" }}>
        <NavLink to="/home" style={{ color: "white", textDecoration: "none" }}>
          <Button style={{ color: "white" }} startIcon={<HomeIcon />}>
            Home
          </Button>
        </NavLink>
      </li>
      <li style={{ display: "inline" }}>
        <NavLink
          to="/dashboard"
          style={{ color: "black", textDecoration: "none" }}
        >
          <Button style={{ color: "white" }}>Dashboard</Button>
        </NavLink>
      </li>
      <li style={{ display: "inline" }}>
        <NavLink to="/users" style={{ color: "black", textDecoration: "none" }}>
          <Button style={{ color: "white" }}>Users</Button>
        </NavLink>
      </li>
      <li style={{ display: "inline" }}>
        <NavLink
          to="/content"
          style={{ color: "black", textDecoration: "none" }}
        >
          <Button style={{ color: "white" }}>Contents</Button>
        </NavLink>
      </li>
      <li style={{ display: "inline" }}>
        <Button style={{ color: "white" }}>
          <div>
            <div
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              Settings
            </div>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <NavLink
                to="/profile"
                style={{ color: "black", textDecoration: "none" }}
              >
                <MenuItem>Profile</MenuItem>
              </NavLink>
              <MenuItem>
                <NavLink
                  to="/email"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Change Email Address
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink
                  to="/pwd"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  Change Password
                </NavLink>
              </MenuItem>
              <MenuItem onClick={props.logout} to="/">
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Button>
      </li>
      <li style={{ display: "inline" }}>
        <Button>
          <NavLink
            to="/profile"
            style={{ color: "black", textDecoration: "none" }}
          >
            <Avatar
              src={
                props.profile.pPic ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              style={{ margin: "5px" }}
            />
          </NavLink>
        </Button>
      </li>
    </ul>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(null, mapDispatchToProps)(LoggedInLink);
