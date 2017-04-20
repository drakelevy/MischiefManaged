import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  Button,
  View
} from 'react-native';

import styles from './SplashStyle';

export default class Splash extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={require('../../assets/images/splash_background.png')} style={styles.backgroundImage}>
          <View style={styles.container}>
            <Text style={styles.title}>
              Mischief Managed
            </Text>
            <Button onPress={() => this.props.changePage("Main")} title="Continue" />
          </View>
        </Image>
      </View>
    );
  }
}


