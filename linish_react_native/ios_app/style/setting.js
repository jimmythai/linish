import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';

export default StyleSheet.create({
  confirmationContainer: {
    paddingTop: 100,
  },
  confirmationText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});