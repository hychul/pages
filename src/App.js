import React from 'react';
import { Fragment } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ReactPage from 'page/ReactPage';
import Navigator from 'component/Navigator/Navigator';
import MainPage from 'page/MainPage';
import TestPage from 'page/TestPage';
import Copyright from 'component/Copyright/Copyright';

function App() {
  return (
    <Fragment>
      <Navigator />
      <div>
        <HashRouter>
          <Switch>
            <Route exact path='/' component={ReactPage} />
            <Route exact path='/main' component={MainPage} />
            <Route exact path='/test' component={TestPage} />
          </Switch>
        </HashRouter>
      </div>
      <div style={{margin: '1px'}}>
        <Copyright/>
      </div>
    </Fragment>
  );
}

export default App;
