import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  NavigatorIOS,
  TouchableHighlight,
} from 'react-native';

import Network from './Network';
import SignoutView from './SignoutView';
// import SignoutViewController from './SignoutViewController';
import DeleteAccountView from './DeleteAccountView';

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
        component = SignoutView;
        break;
      case 1:
        component = DeleteAccountView;
        break;
    }

    this.props.navigator.push({
      title: rowData,
      component: component,
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      
      <TouchableHighlight
        onPress={() => {
          this.onPressRow(rowData, rowID)
        }}>
        <Text>{rowData}</Text>
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