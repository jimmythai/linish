import React, { Component } from 'react';
import { NavigatorIOS } from 'react-native';
import FriendsView from './FriendsView';

import {Actions} from 'react-native-router-flux';

export default class FriendsViewController extends Component {
  handleNavigationRequest() {
    Actions.addFriend({hide: false});
  }

  componentWillReceiveProps(props) {
    console.log(props);
    console.log('componentWillReceivePropstab + fvc')
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(nextProps)
    console.log(nextState)
    console.log('componentWillUpdatetab + fvc')
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: FriendsView,
          title: '友だち',
          rightButtonTitle: 'Add',
          onRightButtonPress: () => this.handleNavigationRequest(),
          barTintColor: '#283147',
          titleTextColor: '#FFFFFF',
          tintColor: '#FFFFFF',
          translucent: false,
        }}
        style={{flex: 1}}
      />
    );
  }
}