import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  namePopup: {
    backgroundColor: 'white',
    width: '80%',
    position: 'absolute',
    left: '10%',
    top: '40%',
    zIndex: 11,
  },
  noPopup: {
    display: 'none',
  },
  nameInput: {
    fontSize: 24,
    width: '90%',
    marginLeft: '5%',
    zIndex: 12,
  },
  nameButton: {
    width: 40,
  }
});

export default styles;
