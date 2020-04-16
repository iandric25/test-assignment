import React from 'react';
import './App.css';
import Header from './components/header';
import Body from './components/body';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';


class App extends React.Component {

  render(){
    return (
      <React.Fragment>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/:id?" component={Body} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
