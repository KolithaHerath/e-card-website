import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";

import {
  Typography,
  Card,
  CardContent,
  Paper,
  Container,
  Grid,
  Grow,
} from "@material-ui/core";

function HomePage(props) {
  const { contact } = props;
  const checked = true;

  if (contact !== undefined) {
    return (
      <div>
        <div style={{ width: "75%", margin: "auto", marginTop: "10px" }}>
          <Paper elevation={0}>
            <Grow
              in={checked}
              style={{ transformOrigin: "0 0 0" }}
              {...(checked ? { timeout: 1000 } : {})}
            >
              <Card
                align="center"
                elevation={0}
                style={{
                  backgroundColor: "#f5f5f5",
                  border: "none",
                }}
              >
                <div>
                  <Typography
                    variant="h3"
                    style={{ backgroundColor: "#f5f5f5" }}
                  >
                    E-Card Website
                    <hr />
                  </Typography>
                </div>
                <Container
                  style={{
                    width: "90%",
                    padding: "15px",
                  }}
                >
                  <Typography variant="body1" align="justify">
                    This website provides information about the E-Card mobile
                    application. The E-Card Mobile application is a digital
                    version of a Rolodex, which means the application will
                    contain the user information relevent to their respective
                    work. A short instruction about the mobile app is provided
                    below.
                  </Typography>
                </Container>
              </Card>
            </Grow>

            <Grow
              in={checked}
              style={{ transformOrigin: "0 0 0" }}
              {...(checked ? { timeout: 1000 } : {})}
            >
              <Card>
                <CardContent>
                  {contact &&
                    contact.map((items) => {
                      return (
                        <div key="anc" style={{ backgroundColor: "#f5f5f5" }}>
                          <Typography
                            variant="h4"
                            style={{
                              backgroundColor: "#3949ab",
                              color: "white",
                              paddingLeft: "5px",
                            }}
                          >
                            Announcement
                          </Typography>
                          <div style={{ paddingLeft: "10px" }}>
                            <Typography variant="h6">
                              Message : {items.msg}
                            </Typography>
                            <Typography variant="body1">
                              Date:{moment(items.date.toDate()).toString()}
                            </Typography>
                          </div>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            </Grow>
            <Grow
              in={checked}
              style={{ transformOrigin: "0 0 0" }}
              {...(checked ? { timeout: 1000 } : {})}
            >
              <Card>
                <div>
                  <CardContent>
                    <Card
                      variant="outlined"
                      style={{
                        width: "750px",
                        float: "left",
                        marginTop: "50px",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5">
                          Login & Register <hr />
                        </Typography>
                        <Typography variant="h6" align="justify">
                          You can login or register in the mobile application
                          using a valid email address and a password.
                          Alternatively the same process can be done through the
                          website as well.
                        </Typography>
                      </CardContent>
                    </Card>
                    <img
                      alt="login view"
                      src="https://firebasestorage.googleapis.com/v0/b/visiting-card-5b274.appspot.com/o/screenshots%2FScreenshot_2020-05-09-10-08-52.png?alt=media&token=2e28ac1a-97e0-4342-8a3e-a9b6b40abe74"
                      style={{
                        float: "right",
                        width: "151px",
                        margin: "10px",
                        border: "3px solid transparent",
                        borderColor: "#3949ab",
                        padding: "15px",
                      }}
                    />
                  </CardContent>
                </div>
              </Card>
            </Grow>

            <Grow in={checked}>
              <Card
                style={{
                  marginTop: "10px",
                  backgroundColor: "#3949ab",
                  color: "white",
                }}
              >
                <div>
                  <CardContent>
                    <Card
                      variant="outlined"
                      style={{
                        width: "750px",
                        float: "right",
                        marginTop: "50px",
                      }}
                    >
                      <CardContent
                        style={{
                          backgroundColor: "#3949ab",
                          color: "white",
                        }}
                      >
                        <Typography variant="h5">
                          Getting a Card of a Person <hr />
                        </Typography>
                        <Typography variant="h6" align="justify">
                          You can get the Card from a user by scanning their QR
                          code displayed only through the E-Card mobile
                          application. And then you can select the Card from the
                          list of contacts that you scanned.
                        </Typography>
                      </CardContent>
                    </Card>
                    <img
                      alt="login view"
                      src="https://firebasestorage.googleapis.com/v0/b/visiting-card-5b274.appspot.com/o/screenshots%2FScreenshot_2020-05-09-10-08-20.png?alt=media&token=0bbe177e-77e8-44ad-a3a7-41c084e70d12"
                      style={{
                        float: "left",
                        width: "151px",
                        margin: "10px",
                        border: "3px solid transparent",
                        borderColor: "white",
                        padding: "15px",
                      }}
                    />
                  </CardContent>
                </div>
              </Card>
            </Grow>

            <Grow in={checked}>
              <Card style={{ marginTop: "10px" }}>
                <div>
                  <CardContent>
                    <Card
                      variant="outlined"
                      style={{
                        width: "750px",
                        float: "left",
                        marginTop: "50px",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h5">
                          Viewing the Selected Card <hr />
                        </Typography>
                        <Typography variant="h6" align="justify">
                          After selecting a Card from the list you can view its
                          information. You also will be able to call the user by
                          clicking on of the mobile numbers or you can e-mail
                          them by clicking on the email address.
                        </Typography>
                      </CardContent>
                    </Card>
                    <img
                      alt="login view"
                      src="https://firebasestorage.googleapis.com/v0/b/visiting-card-5b274.appspot.com/o/screenshots%2FScreenshot_2020-05-09-10-08-33.png?alt=media&token=4eb0a49e-e4ae-4add-b34e-1c91b8e46443"
                      style={{
                        float: "right",
                        width: "151px",
                        margin: "10px",
                        border: "3px solid transparent",
                        borderColor: "#3949ab",
                        padding: "15px",
                      }}
                    />
                  </CardContent>
                </div>
              </Card>
            </Grow>

            <Grow in={checked}>
              <Card>
                <CardContent>
                  {contact &&
                    contact.map((items) => {
                      return (
                        <div key={items.id}>
                          <div>
                            <Typography
                              variant="h4"
                              style={{
                                backgroundColor: "#3949ab",
                                color: "white",
                                paddingLeft: "5px",
                              }}
                            >
                              Contact Us
                            </Typography>
                          </div>
                          <Card>
                            <CardContent>
                              <Grid container spcing={3}>
                                <Grid item xs={6}>
                                  <div>
                                    <Typography variant="h6">
                                      About Mobile Application
                                      <hr />
                                    </Typography>
                                    <Typography>
                                      Name: {items.fN1} {items.lN1}
                                    </Typography>
                                    <Typography>
                                      Contact Number: +94{parseInt(items.pNo1)}
                                    </Typography>
                                    <Typography>
                                      Email Address: {items.eM1}
                                    </Typography>
                                  </div>
                                </Grid>
                                <Grid item xs={6}>
                                  <div>
                                    <Typography variant="h6">
                                      About Web Application
                                      <hr />
                                    </Typography>
                                    <Typography>
                                      Name: {items.fN2} {items.lN2}
                                    </Typography>
                                    <Typography>
                                      Contact Number: +94{parseInt(items.pNo2)}
                                    </Typography>
                                    <Typography>
                                      Email Address: {items.eM2}
                                    </Typography>
                                  </div>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            </Grow>
          </Paper>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Card style={{ width: "100%", height: "100%" }}></Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contact: state.firestore.ordered.news,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "news" }])
)(HomePage);
