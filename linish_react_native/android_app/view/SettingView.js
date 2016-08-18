import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  Navigator,
  TouchableHighlight,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import Network from './Network';
// import SignoutView from './SignoutView';
import baseStyle from '../style/base';

// import DeleteAccountView from './DeleteAccountView';

export default class SettingView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['ログアウト', '退会']),
    };
  }

  onPressRow(rowData, rowID) {
    const rowId = parseInt(rowID, 10);
    let component;
    switch (rowId) {
      case 0:
        this.props.navigator.push({key: 'signout',});
        break;
      case 1:
        this.props.navigator.push({key: 'deleteAccount',});
        break;
    }
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      
      <TouchableHighlight
        underlayColor='#E5E5E5'
        onPress={() => {
          this.onPressRow(rowData, rowID)
        }}>
        <View style={baseStyle.listItem}>
          <Text>{rowData}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: 1,
          backgroundColor: '#F8F8F8',
        }}
      >
      </View>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator}
      />
    );
  }
}