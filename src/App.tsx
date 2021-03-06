import React from 'react';
import logo from './logo.svg';
import Main from './Main';
import { connect } from 'react-redux';
import { AppState } from './reducers/index';
import About from './About';
import Dashboard from './Dashboard';
import ReceivedInheritance from './ReceivedInheritance';

const App = (props: any) => {
  switch (props.view) {
    case 'MAIN': return (<Main />);
    case 'DASHBOARD': return (<Dashboard/>);
    case 'RECEIVED_INHERITANCE': return (<ReceivedInheritance/>);
    case 'ABOUT_PROJECT': return (<About/>);
  }
  return (
    <div className="App">Router Error: Unknown View</div>
  );
}

const mapStateToProps = (state: AppState) => ({ view: state.view });
export default connect(mapStateToProps, {})(App);
