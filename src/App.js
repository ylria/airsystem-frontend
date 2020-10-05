import React, { useState, useEffect, useRef } from "react"
import { connect } from "react-redux"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import MainView from "./views/main/MainView"
import SubpageView from "./views/subpage/SubpageView"
import ActivationView from "./views/activateAccount/ActivationView"
import Login from "./components/Login"
import Charts from "./components/Charts"
import { refreshLogin } from "./config/ApiCalls"

function App(props) {

  useEffect(() => {
    const tryRefreshLogin = async () => await refreshLogin(props.dispatch)
    tryRefreshLogin()
    .catch(_ => {})
  }, [])

  return (
    <BrowserRouter>
      <Login />
      <Charts />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => {
            return <MainView />;
          }}
        />
        <Route
          exact
          path="/subpage"
          render={(props) => {
            return <SubpageView />;
          }}
        />
        <Route
          exact
          path="/activateAccount/:email/:activationCode"
          render={(props) => {
            return <ActivationView {...props} />;
          }}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default connect()(App);
