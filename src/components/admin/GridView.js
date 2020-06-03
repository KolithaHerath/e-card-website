import React, { useState } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Card from "@material-ui/core/Card";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@material-ui/core";

import { deleteUser } from "../../store/actions/adminAction";

function getData(profiles) {
  const rows = [];
  if (profiles !== undefined) {
    profiles.map((profile) => rows.push(profile));
  }
  return rows;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "fN",
    numeric: false,
    disablePadding: true,
    label: "Full Name",
  },
  { id: "cmp", numeric: true, disablePadding: false, label: "Company" },
  { id: "pos", numeric: true, disablePadding: false, label: "Position" },
  { id: "pNo", numeric: true, disablePadding: false, label: "Personal Number" },
  {
    id: "eM",
    numeric: true,
    disablePadding: false,
    label: "E-Mail",
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow style={{ background: "#3f51b5" }}>
        <TableCell>{""}</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ color: "white" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              style={{ color: "white" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function GridView(props) {
  const { profiles } = props;
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fN");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [term, setTerm] = useState("");
  const [id, setID] = useState("fN");

  const [open, setOpen] = useState(false);

  const [prof, setProf] = useState({});

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

  const handleClickOpen = (prof) => {
    setProf(prof);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Returns Snackbar when deleteing a user from the table
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
        message="User Deleted"
        action={
          <React.Fragment>
            {prof.fN} {prof.lN}
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

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  function handleID(e) {
    setID(e.target.id);
  }

  // Set the text that will be used to search the table
  function searchBar(e) {
    setTerm(e.target.value);
  }

  // Search function that searches the table for a match
  function searchingFor(term, type) {
    return function (x) {
      return x[type].toLowerCase().includes(term.toLowerCase()) || !term;
    };
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const rows = getData(profiles)
    .filter(searchingFor(term, id))
    .map((person) => {
      return person;
    });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const [item, setItem] = useState("First Name");

  const handleChange = (event) => {
    setItem(event.target.value);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  function handleDialog(row) {
    return (
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
            Are you sure that you want to delete {row.fN} {row.lN} from your
            list of connection?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={(e) => handleDelete(row.id)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function handleDelete(id) {
    props.deleteUser(id);
    handleClose();
    handleClick();
  }
  return (
    <div className={classes.root}>
      {snackbar ? handleSnackBar() : null}
      <Card className={classes.paper} variant="outlined">
        <div style={{ display: "inline", float: "left", margin: "10px" }}>
          <h2>Registered Users</h2>
        </div>
        <div style={{ display: "inline", float: "right", margin: "10px" }}>
          <TextField id="standard-basic" label="Search" onChange={searchBar} />
          <div style={{ float: "right", marginLeft: "5px" }}>
            <InputLabel id="demo-simple-select-label">Search By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={item}
              onChange={handleChange}
            >
              <MenuItem
                id="fN"
                value={"First Name"}
                onClick={(e) => handleID(e)}
              >
                First Name
              </MenuItem>
              <MenuItem
                id="lN"
                value={"Last Name"}
                onClick={(e) => handleID(e)}
              >
                Last Name
              </MenuItem>
              <MenuItem id="cmp" value={"Company"} onClick={(e) => handleID(e)}>
                Company
              </MenuItem>
            </Select>
          </div>
        </div>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              itemList={selected}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <IconButton
                          id={row.id}
                          style={{
                            backgroundColor: "#3f51b5",
                            margin: "5px",
                            color: "white",
                          }}
                          onClick={(e) => handleClickOpen(row)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        {open ? handleDialog(prof) : null}
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        <Link
                          to={"/profile/" + row.id}
                          key={row.id}
                          style={{ textDecoration: "none" }}
                        >
                          {row.fN + " " + row.lN}
                        </Link>
                      </TableCell>
                      <TableCell align="right">{row.cmp}</TableCell>
                      <TableCell align="right">{row.pos}</TableCell>
                      <TableCell align="right">{row.pNo}</TableCell>
                      <TableCell align="right">{row.eM}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Card>
      <FormControlLabel
        control={
          <Switch
            checked={dense}
            onChange={handleChangeDense}
            color="primary"
          />
        }
        label="Dense padding"
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    profiles: state.firestore.ordered.user, // get the  list of user from the firestore
    auth: state.firebase.auth,
    current_user: state.firebase.profile,
  };
};

export default compose(
  connect(mapStateToProps, { deleteUser }),
  firestoreConnect([{ collection: "user" }])
)(GridView);
