import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import baseStyles from '../style/base';
import Network from './Network';

export default class AddFriendView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: '',
      errorText: '',
      isUserIdVisivle: false,
      isErrorTextVisible: false,
      isAddButtonVisible: false,
      isSearchActive: false,

      hide: props.hide,
    }
  }

  async _onPressSearchButton() {
    if(!this.state.isSearchActive) return;

    const res = await Network._fetch({
      path: '/accounts/' + this.state.userId,
      method: 'GET',
    });

    if(res.code === 400) {
      this.setState({
        errorText: res.error,
        isErrorTextVisible: true,
      });
    } else {
      this.setState({
        isUserIdVisivle: true,
        isAddButtonVisible: true,
      });
    }
  }

  async _onPressAddButton() {
    const res = await Network._fetch({
      path: '/friends/add',
      method: 'POST',
      body: {
        followed_id: this.state.userId,
      }
    });

    if(res.code === 400) {
      this.setState({
        errorText: res.error,
        isErrorTextVisible: true,
      });
    } else {
      Actions.pop();
      Actions.refresh({frined: this.state.userId});
    }
  }

  toggleUserId() {

  }

  toggleErrorText() {

  }

  _onChangeText(userId) {
    const isNotUserIdEmpty = userId !== '';

    this.setState({
      userId: userId,
    });

    if(isNotUserIdEmpty) {
      this.setState({
        isSearchActive: true,
      });
    } else {
      this.setState({
        isSearchActive: false,
      });
    }

    if(this.state.isUserIdVisivle) {
      this.setState({
        isUserIdVisivle: false,
      });
    }
    if(this.state.isErrorTextVisible) {
      this.setState({
        isErrorTextVisible: false,
      });
    }
    if(this.state.isAddButtonVisible) {
      this.setState({
        isAddButtonVisible: false,
      });
    }
  }

  _renderUserId() {
    if(this.state.isUserIdVisivle) {
      return (
        <Text style={selfStyles.userId}>{this.state.userId}</Text>
      );
    } else {
      return null;
    }
  }

  _renderErrorText() {
    if(this.state.isErrorTextVisible) {
      return (
        <Text style={selfStyles.errorText}>{this.state.errorText}</Text>
      );
    } else {
      return null;
    }
  }

  _renderAddButton() {
    if(this.state.isAddButtonVisible) {
      return (
        <Text
          style={selfStyles.addButton}
          onPress={() => {
            this._onPressAddButton();
          }}
        >友だちを追加</Text>
      );
    } else {
      return null;
    }
  }

  render() {
    let searchIcon = this.state.isSearchActive ? require('../../images/Icon-Small-9.png') : require('../../images/Icon-Small-8.png');

    if(this.state.hide) {
      return (
        <View></View>
      );
    } else {
      return (
        <View style={[baseStyles.wrapper ,baseStyles.wrapperForNavigator, baseStyles.wrapperForTabBarNavigation]}>
          <View style={[baseStyles.container, selfStyles.searchContainer]}>
            <View style={selfStyles.searchBoxArea}>
              <TextInput
                style={[baseStyles.textBox, selfStyles.searchBox]}
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(userId) => {this._onChangeText(userId);}}
                value={(this.state && this.state.userId) || ''}
              />
              <Text
                style={[selfStyles.searchButton, this.state.isSearchActive ? selfStyles.searchActive : selfStyles.searchInActive]}
                onPress={()=>{
                  this._onPressSearchButton();
                }}
              >
                <Image source={searchIcon} />
              </Text>
            </View>
            <View style={[selfStyles.outPutContainer]}>
              {this._renderUserId()}
              {this._renderErrorText()}
              {this._renderAddButton()}
            </View>
          </View>
        </View>
      );
    }
  }
}



const selfStyles = StyleSheet.create({
  searchContainer: {
    marginTop: 50,
  },
  outPutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  searchBoxArea: {
    position: 'relative',
  },
  searchBox: {
  },
  searchButton: {
    position: 'absolute',
    top: 9,
    right: 5,
  },
  searchActive: {
    color: 'green',
  },
  searchInActive: {
    color: 'black',
  },
  userId: {
  },
  errorText: {
    marginTop: 10,
  },
  addButton: {
    marginTop: 30,
    color: '#0D94FC',
  },
});