import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Alert,
  Text,
  TextInput,
  AsyncStorage,
  Image,
  Button,
  View
} from 'react-native';
import MapView from 'react-native-maps';

import styles from './MainStyle';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameSet: true,
      region: {
        latitude: 37.871899,
        longitude: -122.258540,
        latitudeDelta: 0.007,
        longitudeDelta: 0.007,
      }
    };
    this.initUser = this.initUser.bind(this);
    this.saveID = this.saveID.bind(this);
    this.getUserLocations = this.getUserLocations.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  componentDidMount() {
    AsyncStorage.multiGet(["id", "name"]).then((stores) => {
      console.log(stores);
      var name = stores[1][1];
      var id = stores[0][1];
      if (name && id) {
        this.setState({ name });

        fetch('http://192.168.1.33:8080/init', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, id: parseInt(id, 10) })
        })
        .then(res => res.json())
        .then(res => {
          this.saveID(res.id);
          this.updatePosition();
          this.getUserLocations();
        })
        .catch(err => console.error(err));

        Alert.alert("Hello " + name);
      } else {
        this.setState({ nameSet: false });
      }
    });

    // Update locations every 5 seconds
    setInterval(() => {
      this.updatePosition();
      this.getUserLocations();
      console.log("UPDATED");
    }, 5000);
  }

  updatePosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
        fetch('http://192.168.1.33:8080/location', {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.state.id,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  saveID(id) {
    this.setState({ id });
    AsyncStorage.setItem('id', id.toString());
  }

  getUserLocations() {
    fetch('http://192.168.1.33:8080/locations', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(res => {
      var userLocations = [];
      Object.keys(res).forEach((key, index) => {
        var user = res[key];
        if (user.lat && user.lon) {
          userLocations.push(user);
        }
      });
      this.setState({ userLocations });
    });
  }

  // Call to backend here to get all user's locations/info
  getUserMarkers() {
    var userMarkers = [];
    var userLocations = this.state.userLocations ? this.state.userLocations : [];
    for (var i = 0; i < userLocations.length; i += 1) {
      var user = userLocations[i];
      if (user.id === this.state.id) continue;
      userMarkers.push(
        <MapView.Marker
          key={user.id}
          coordinate={{ latitude: user.lat, longitude: user.lon }}
          title={user.name}
          image={require('../../assets/images/map_footsteps.png')}
        />
      );
    }
    if (this.state.latitude && this.state.longitude) {
      userMarkers.push(
        <MapView.Marker
          key={this.state.id}
          coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
          title={this.state.name}
          image={require('../../assets/images/map_footsteps.png')}
        />
      );
    }
    return userMarkers;
  }

  initUser() {
    this.setState({ nameSet: true });
    AsyncStorage.setItem('name', this.state.name);

    fetch('http://192.168.1.33:8080/init', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: this.state.name })
    })
    .then(res => res.json())
    .then(res => this.saveID(res.id))
    .catch(err => console.error(err));
  }

  onRegionChange(region) {
    region.latitudeDelta = 0.007;
    region.longitudeDelta = 0.007;
    this.setState({ region });
  }

  render() {
    return (
      <View style ={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >
          <MapView.UrlTile
           // http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
            urlTemplate="http://192.168.1.33:8080/map/{z}/{x}/{y}.pngggg"
          />
          {this.getUserMarkers()}
        </MapView>
        <View style={!this.state.nameSet ? styles.namePopup : styles.noPopup}>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name..."
            onChangeText={(name) => this.setState({name})}
          />
          <Button
            style={styles.nameButton}
            onPress={this.initUser}
            title="Done"
          />
        </View>
      </View>
    );
  }
}
