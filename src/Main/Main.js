import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  Button,
  View
} from 'react-native';
import MapView from 'react-native-maps';

import styles from './MainStyle';

export default class Main extends Component {

  // Call to backend here to get all user's locations/info
  getUserMarkers() {
    return (
      <MapView.Marker
        coordinate={{latitude: 37.871899, longitude: -122.258540}}
        title="Test"
        description="This is a test marker"
        image={require('../../assets/images/map_footsteps.png')}
      />
    );
  }

  render() {
    return (
      <View style ={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: 37.871899,
            longitude: -122.258540,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          {this.getUserMarkers()}
        </MapView>
      </View>
    );
  }
}
