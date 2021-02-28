import React from 'react';
import { Fragment } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ReactPage from 'page/ReactPage';
import MainPage from 'page/MainPage';
import Copyright from 'component/Copyright/Copyright';

function App() {
  return (
    <Fragment>
      <div>
        <HashRouter>
          <Switch>
            <Route exact path='/' component={ReactPage} />
            <Route exact path='/main' component={MainPage} />
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
