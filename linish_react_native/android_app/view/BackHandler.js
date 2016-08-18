import React, { Component } from 'react';
import {
  BackAndroid,
} from 'react-native';

export default class BackHandler extends Component {
  constructor(props) {
    super(props)
  }

  static popToPrevious(navigator, callBackFunc = () => {}) {
    const pop = (navigator, callBackFunc) => {
      return function(e) {
        callBackFunc();
        navigator.pop();
        return true;
      }
    }

    BackAndroid.addEventListener('hardwareBackPress', pop(navigator, callBackFunc));
  }
}