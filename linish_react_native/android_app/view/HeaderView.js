import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

export default class HeaderView extends Component {
  constructor(props) {
    super(props);
  }
  renderTitle() {
    if(!this.props.titleVisible) {
      return null;
    }
    return <Text style={selfStyles.navigationBarTitle}>{this.props.title}</Text>;
  }

  renderRightButton() {
    if(!this.props.rightButtonVisible) {
      return null;
    }
    return <Text style={selfStyles.navigationBarRightButton}>{this.props.rightButton}</Text>;
  }

  render() {
    return (
      <View
        style={selfStyles.navigationBar}
      >
        {this.renderTitle()}
        {this.renderRightButton()}
      </View>
    );
  }
}

HeaderView.propTypes = {
  title: React.PropTypes.string.isRequired,
  rightButton: React.PropTypes.string,
  titleVisible: React.PropTypes.bool,
  rightButtonVisible: React.PropTypes.bool,
}

HeaderView.defaultProps = {
  title: '',
  rightButton: '',
  titleVisible: true,
  rightButtonVisible: true,
}

const selfStyles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 60,
  },
  navigationBar: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 59,
    backgroundColor: '#283147',
    elevation: 7,
  },
  navigationBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  navigationBarRightButton: {
    color: '#FFFFFF',
  },
});