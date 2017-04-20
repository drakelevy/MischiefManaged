import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  View
} from 'react-native';

import styles from './AppStyle';
import Splash from '../Splash/Splash'
import Main from '../Main/Main'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 'Splash' };
/*    this.getCurrentPage = this.getCurrentPage.bind(this); */
    this.changePage = this.changePage.bind(this);
  }

  changePage(currentPage) {
    this.setState({ currentPage });
  }

  getCurrentPage(currentPage) {
    switch(currentPage) {
      case 'Splash':
        return <Splash changePage={this.changePage} />
      case 'Main':
        return <Main changePage={this.changePage} />
      default:
        return <Text>An error occured, please reboot the app</Text>
    }
  }

  render() {
    return (
      <View style={styles.rootContainer}>
        {this.getCurrentPage(this.state.currentPage)}
      </View>
    );
  }
}

AppRegistry.registerComponent('MischiefManaged', () => App);
