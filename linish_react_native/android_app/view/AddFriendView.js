import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  InteractionManager,
} from 'react-native';

import baseStyles from '../style/base';
import Network from './Network';
import DismissKeyboard from './DismissKeyboard';
import BackHandler from './BackHandler';
import HeaderView from './HeaderView';
import TextField from './TextField';

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

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      BackHandler.popToPrevious(this.props.navigator);
    });
  }

  async _onPressSearchButton() {
    if(!this.state.isSearchActive) {
      return;
    }

    const res = await Network._fetch({
      path: '/accounts/' + this.state.userId,
      method: 'GET',
    });

    if(await res.code === 400) {
      this.setState({
        errorText: res.error,
        isUserIdVisivle: false,
        isAddButtonVisible: false,
        isErrorTextVisible: true,
      });
    } else {
      this.setState({
        errorText: '',
        isUserIdVisivle: true,
        isAddButtonVisible: true,
        isErrorTextVisible: false,
      });
    }

    await this.refs['searchBox'].refs['textField'].blur();
  }

  async _onPressAddButton() {
    const res = await Network._fetch({
      path: '/friends/add',
      method: 'POST',
      body: {
        followed_id: this.state.userId,
      }
    });

    if(await res.code === 400) {
      this.setState({
        errorText: res.error,
        isErrorTextVisible: true,
      });
    } else {
      this.props.navigator.pop();
    }
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
      return (
        <Text></Text>
      );
    }
  }

  _renderErrorText() {
    if(this.state.isErrorTextVisible) {
      return (
        <Text style={selfStyles.errorText}>{this.state.errorText}</Text>
      );
    } else {
      return (
        <Text></Text>
      );
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
      return (
        <Text></Text>
      );
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
        <TouchableWithoutFeedback
          onPress={DismissKeyboard.dismissKeyboard.bind(this, ['searchBox'], 'textField')}
        >
          <View style={selfStyles.wrapper}>
            <HeaderView
              title="ID検索"
            />
            <View style={[baseStyles.wrapper ,baseStyles.wrapperForNavigator,]}>
              <View style={[baseStyles.container, selfStyles.searchContainer]}>
                <View style={selfStyles.searchBoxArea}>
                  <TextField
                    ref='searchBox'
                    autoCapitalize='none'
                    autoCorrect={false}
                    blurOnSubmit={true}
                    returnKeyType='search'
                    onChangeText={(userId) => {this._onChangeText(userId);}}
                    value={(this.state && this.state.userId) || ''}
                    onSubmitEditing={() => this._onPressSearchButton()}
                  />
                  <Text
                    style={selfStyles.searchButton}
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
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
}

const selfStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 40,
  },
  searchBox: {
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
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