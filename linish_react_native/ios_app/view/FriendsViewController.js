import React, { Component } from 'react';
import {
  NavigatorIOS,
  StatusBar
} from 'react-native';
import FriendsView from './FriendsView';

import {Actions} from 'react-native-router-flux';

export default class FriendsViewController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: '',
    };
  }

  handleNavigationRequest() {
    Actions.addFriend({hide: false});
  }

  componentWillReceiveProps(props) {
    console.log(props);
    this.setState({
      friends: props.friends,
    });
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
          passProps: {friends: this.state.friends}
        }}
        style={{flex: 1}}
      />
    );
  }
}