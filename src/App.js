import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ReactPage from 'page/ReactPage';
import Navigator from 'component/navigator/Navigator';
import PostListPage from 'page/PostListPage';
import PostPage from 'page/PostPage';
import DevgramPage from 'page/DevgramPage';
import PortfolioPage from 'page/PortfolioPage';
import TestPage from 'page/TestPage';
import Copyright from 'component/copyright/Copyright';
import ScrollToTop from 'component/ScrollToTop';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: 'white',
    }}>
      <Navigator />
      <ScrollToTop />
      <div style={{
        width: '100%',
        minHeight: 'calc(100vh - 4rem - 10px*2 - 42px*2)'
      }}>
        <Switch>
          <Route exact path='/' component={PostListPage} />
          <Route exact path='/posts' component={PostListPage} />
          <Route exact path='/posts/:id' component={PostPage} />
          <Route exact path='/devgram' component={DevgramPage} />
          <Route exact path='/portfolio' component={PortfolioPage} />
          <Route exact path='/react' component={ReactPage} />
          <Route exact path='/test' component={TestPage} />
        </Switch>
      </div>
      <div style={{
        width: 'calc(100% - 2vmin * 2)',
        marginTop: '10px 2vmin',
        borderTop: 'solid 1px #EAECEF',
        padding: '42px 0px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#242A2D',
      }}>
        <Copyright/>
      </div>
    </div>
  );
}

export default App;
