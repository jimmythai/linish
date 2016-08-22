import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

import TextField from '../TextField';

export default class AddFriendSearchBox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={selfStyles.searchBoxArea}>
        <TextField
          ref='searchBox'
          autoCapitalize='none'
          autoCorrect={false}
          blurOnSubmit={true}
          returnKeyType='search'
          value={this.props.value}
          onChangeText={(userId) => {this.props.onChangeText(userId)}}
          onSubmitEditingText={() => {this.props.onPressSearchButton()}}
        />
        <Text
          style={selfStyles.searchButton}
          onPress={()=>{this.props.onPressSearchButton()}}
        >
          <Image source={this.props.searchIcon} />
        </Text>
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  searchBoxArea: {
    position: 'relative',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: 40,
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

AddFriendSearchBox.PropsTypes = {
  onChangeText: React.PropTypes.func,
  onPressSearchButton: React.PropTypes.func,
  value: React.PropTypes.string,
  isSearchActive: React.PropTypes.bool,
}
