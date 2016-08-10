import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
} from 'react-native';

// import { SwipeListView } from 'react-native-swipe-list-view';

import Network from './Network';

export default class FriendsView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['r1', 'r2']),
    };

    this.setDataSource(ds);
  }

  async setDataSource(ds) {
    const res = await Network._fetch({
      path: '/friends',
      method: 'GET',
    });
    const friends = await res.json();

    this.setState({
      dataSource: ds.cloneWithRows(friends),
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <Text>{rowData}</Text>
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
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
      />
    );
  }
}