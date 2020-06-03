import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Bar, Line } from "react-chartjs-2";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import MinimizeIcon from "@material-ui/icons/Minimize";

function Graphs(props) {
  const [chartAData, setchartAData] = useState({});
  const [chartBData, setchartBData] = useState({});
  const [noUsers, setNoUsers] = useState([]);
  const [prevUser, setPrevUser] = useState([]);
  const [prevConn, setPrevConn] = useState([]);
  const [noConn, setNoConn] = useState([]);
  const [lwUser, setlwUser] = useState([]);
  const [lwConn, setlwConn] = useState([]);
  const [usageValue, setUsageValue] = useState([]);
  const [prevValue, setPrevValue] = useState([]);

  let list = [];
  let users = [];
  let conn = [];
  let userPrev = [];
  let connPrev = [];
  let usageRate = [];
  let prevData = [];
  let now = new Date();
  let day = now.getDay() === 0 ? 6 : now.getDay();

  const { dataList, auth, current_user } = props;
  const chart = () => {
    dataList &&
      dataList.map((data) => {
        return list.push(data);
      });
    if (list !== undefined) {
      for (let i = 0; i < day; i++) {
        if (list.length !== 0) {
          usageRate.push((list[i].noConn / list[i].noUser).toFixed(2));
          users.push(list[i].noUser);
          conn.push(list[i].noConn);
        }
      }
      setUsageValue(usageRate);
      setNoUsers(users[day - 1]);
      setNoConn(conn[day - 1]);
      if (list[6] !== undefined) {
        for (let j = 0; j < list[6].prevC.length; j++) {
          prevData.push((list[6].prevD[j] / list[6].prevC[j]).toFixed(2));
          userPrev.push(list[6].prevD[j]);
          connPrev.push(list[6].prevC[j]);
        }
        setPrevValue(prevData);
        setlwUser(userPrev);
        setlwConn(connPrev);
        if (day === 1) {
          setPrevUser(list[6].prevD[6]);
          setPrevConn(list[6].prevC[6]);
        } else {
          setPrevUser(users[day - 2]);
          setPrevConn(conn[day - 2]);
        }
      }
    }
    setchartAData({
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      datasets: [
        {
          label: "Current Week Density",
          data: usageRate,
          borderColor: ["rgba(54,162,235,0.6"],
          borderWidth: 4,
          fill: false,
          pointBackgroundColor: "rgba(54,162,235,0.6)",
          pointBorderWidth: "20px",
          pointRadius: 5,
          hoverBackgroundColor: "grey",
        },
        {
          label: "Previous Week Density",
          data: prevData,
          borderColor: ["rgba(255,99,132,0.6)"],
          borderWidth: 4,
          fill: false,
          pointBackgroundColor: "rgba(255,99,132,0.6)",
          pointBorderWidth: "20px",
          pointRadius: 5,
          hoverBackgroundColor: "grey",
        },
      ],
    });

    setchartBData({
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      datasets: [
        {
          label: "Current Week Users",
          data: users,
          backgroundColor: [
            "rgba(255,99,132,0.6",
            "rgba(54,162,235,0.6",
            "rgba(255,206,86,0.6",
            "rgba(75,192,192,0.6",
            "rgba(153,102,255,0.6",
            "rgba(255,159,64,0.6",
            "rgba(255,99,132,0.6",
          ],
          borderColor: [
            "rgba(255,99,132,0.6",
            "rgba(54,162,235,0.6",
            "rgba(255,206,86,0.6",
            "rgba(75,192,192,0.6",
            "rgba(153,102,255,0.6",
            "rgba(255,159,64,0.6",
            "rgba(255,99,132,0.6",
          ],
          borderWidth: 2,
          pointBackgroundColor: "rgba(54,162,235,0.6)",
          pointBorderWidth: "20px",
          hoverBackgroundColor: "grey",
        },
      ],
    });
  };
  useEffect(() => {
    chart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataList]);

  function checkStatusOfUsers() {
    if (noConn !== undefined) {
      if (noUsers < prevUser) {
        return (
          <div align="left">
            <Typography variant="h6">Previous Week : {lwUser[day]}</Typography>
            <Typography variant="h6">Yesterday : {prevUser}</Typography>
            <Typography variant="h6">
              Today : {noUsers}
              <ArrowDownwardIcon style={{ color: "#b71c1c" }} />
            </Typography>
          </div>
        );
      } else if (noUsers > prevUser) {
        return (
          <div align="left">
            <Typography variant="h6">Previous Week : {lwUser[day]}</Typography>
            <Typography variant="h6">Yesterday : {prevUser}</Typography>
            <Typography variant="h6">
              Today : {noUsers}
              <ArrowUpwardIcon style={{ color: "#00c853" }} />
            </Typography>
          </div>
        );
      } else {
        return (
          <div align="left">
            <Typography variant="h6">Previous Week : {lwUser[day]}</Typography>
            <Typography variant="h6">Yesterday : {prevUser}</Typography>
            <Typography variant="h6">
              Today : {noUsers}
              <MinimizeIcon style={{ color: "#212121" }} />
            </Typography>
          </div>
        );
      }
    }
  }

  function checkStatusOfConnection() {
    if (noConn !== undefined) {
      if (noConn < prevConn) {
        return (
          <div align="left">
            <Typography variant="h6">Previous Week : {lwConn[day]}</Typography>
            <Typography variant="h6">Yesterday : {prevConn}</Typography>
            <Typography variant="h6">
              Today : {noConn}
              <ArrowDownwardIcon style={{ color: "#b71c1c" }} />
            </Typography>
          </div>
        );
      } else if (noConn > prevConn) {
        return (
          <div align="left">
            <Typography variant="h6">Previous Week : {lwConn[day]}</Typography>
            <Typography variant="h6">Yesterday : {prevConn}</Typography>
            <Typography variant="h6">
              Today : {noConn}
              <ArrowUpwardIcon style={{ color: "#00c853" }} />
            </Typography>
          </div>
        );
      } else {
        return (
          <div align="left">
            <Typography variant="h6">Previous Week : {lwConn[day]}</Typography>
            <Typography variant="h6">Yesterday : {prevConn}</Typography>
            <Typography variant="h6">
              Today : {noConn}
              <MinimizeIcon style={{ color: "#212121" }} />
            </Typography>
          </div>
        );
      }
    }
  }
  if (auth.isEmpty) return <Redirect to="/login" />;

  // check if the email is verified or not
  if (!auth.emailVerified) return <Redirect to="/verify" />;

  // check if the current user is an admin or not
  if (!current_user.status) return <Redirect to="/" />;

  var prevDay = day === 1 ? 6 : day - 2;

  return (
    <div
      style={{
        position: "relative",
        margin: "auto",
        marginTop: "10px",
        marginBottom: "20px",
      }}
    >
      <Grid container spcing={3}>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent>
              <Line
                type={"line"}
                data={chartAData}
                options={{
                  responsive: true,
                  title: { text: "Mobile Usage", display: true, fontSize: 25 },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10,
                          beginAtZero: true,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                    xAxes: [
                      {
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                  },
                  tooltips: {
                    enabled: true,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined">
            <CardContent>
              <Bar
                type={"bar"}
                data={chartBData}
                options={{
                  responsive: true,
                  title: {
                    text: "Number of Users",
                    display: true,
                    fontSize: 25,
                  },
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10,
                          beginAtZero: true,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                    xAxes: [
                      {
                        ticks: {
                          autoSkip: true,
                          maxTicksLimit: 10,
                        },
                        gridLines: {
                          display: true,
                        },
                      },
                    ],
                  },
                  tooltips: {
                    enabled: true,
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <div>
                <Typography variant="h5" align="center">
                  Mobile Application Usage <hr />
                </Typography>
              </div>
              <div style={{ margin: "auto", width: "45%" }} align="center">
                <div align="left">
                  <Typography variant="h6">
                    Previous Week: {prevValue[day - 1]}
                  </Typography>

                  <Typography variant="h6">
                    Yesterday : {usageValue[prevDay]}
                  </Typography>
                  <Typography variant="h6">
                    Today : {usageValue[day - 1]}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4} align="justify">
          <Card>
            <CardContent>
              <div>
                <Typography variant="h5" align="center">
                  Number of Connections <hr />
                </Typography>
              </div>
              <div style={{ margin: "auto", width: "45%" }} align="center">
                {checkStatusOfConnection()}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <div>
                <Typography variant="h5" align="center">
                  Number of Users <hr />
                </Typography>
              </div>
              <div style={{ margin: "auto", width: "40%" }} align="center">
                {checkStatusOfUsers()}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => {
  let list = state.firestore.ordered.Graph;
  if (list !== undefined) {
    return {
      dataList: list,
      auth: state.firebase.auth,
      current_user: state.firebase.profile,
    };
  } else {
    return {
      dataList: undefined,
      auth: state.firebase.auth,
      current_user: state.firebase.profile,
    };
  }
};
export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "Graph" }])
)(Graphs);
