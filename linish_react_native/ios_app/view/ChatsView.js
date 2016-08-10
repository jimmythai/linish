import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
} from 'react-native';

// import { SwipeListView } from 'react-native-swipe-list-view';

import Network from './Network';

export default class ChatsView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };

    this.setDataSource(ds);
  }

  async setDataSource(ds) {
    // let rows = [];
    const res = await Network._fetch({
      path: '/rooms',
      method: 'GET',
    });
    const rooms = await res.json();

    let rows = rooms.map(function(obj) {
      let users = obj.user_ids;
      let usersString = users.join(',');

      let updatedAt = obj.updated_at;
      let date = new Date(updatedAt);
      let formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();

      return {user_ids, updated_at} = {user_ids: usersString, updated_at: formattedDate};
    });

    this.setState({
      dataSource: ds.cloneWithRows(rows),
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View>
        <Text>{rowData.user_ids}</Text>
        <Text>{rowData.updated_at}</Text>
      </View>
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