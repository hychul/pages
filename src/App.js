import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ReactPage from 'page/ReactPage';

function App() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route exact path="/" component={ReactPage} />
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
