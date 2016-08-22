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

import baseStyles from '../../style/base';
import Network from '../Network';
import DismissKeyboard from '../DismissKeyboard';
import BackHandler from '../BackHandler';
import HeaderView from '../HeaderView';

import AddFriendOutput from './AddFriendOutput';
import AddFriendSearchBox from './AddFriendSearchBox';

export default class AddFriend extends Component {
  constructor(props) {
    super(props);

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

  async onPressSearchButton() {
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

    await new AddFriendSearchBox().refs['searchBox'].refs['textField'].blur();
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
      await this.setState({
        errorText: res.error,
        isErrorTextVisible: true,
      });
    } else {
      await this.props.navigator.pop();
    }
  }

  onChangeText(userId) {
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

  render() {
    if(this.state.hide) {
      return (
        <View></View>
      );
    }

    return (
      <TouchableWithoutFeedback
        onPress={DismissKeyboard.dismissKeyboard.bind(this, ['searchBox'], 'textField', new AddFriendSearchBox())}
      >
        <View style={selfStyles.wrapper}>
          <HeaderView
            title="ID検索"
          />
          <View style={[baseStyles.wrapper ,baseStyles.wrapperForNavigator,]}>
            <View style={[baseStyles.container, selfStyles.searchContainer]}>
              <AddFriendSearchBox
                onChangeText={this.onChangeText.bind(this)}
                onPressSearchButton={this.onPressSearchButton.bind(this)}
                value={(this.state && this.state.userId) || ''}
                isSearchActive={this.state.isSearchActive}
                searchIcon={this.state.isSearchActive ? require('../../images/Icon-Small-9.png') : require('../../images/Icon-Small-8.png')}
              />
              <AddFriendOutput
                isAddButtonVisible={this.state.isAddButtonVisible}
                isErrorTextVisible={this.state.isErrorTextVisible}
                isUserIdVisivle={this.state.isUserIdVisivle}
                userId={this.state.userId}
                errorText={this.state.errorText}
                onPress={this._onPressAddButton}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
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
});