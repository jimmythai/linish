import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

// import { SwipeListView } from 'react-native-swipe-list-view';
import {Actions} from 'react-native-router-flux';

import baseStyles from '../style/base';
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

    let rows = res.map(function(obj) {
      let users = obj.user_ids;
      let usersString = users.join(',');

      let updatedAt = obj.updated_at;
      let date = new Date(updatedAt);
      let formattedDate = (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();

      return {user_ids, updated_at, roomId} = {user_ids: usersString, updated_at: formattedDate, roomId: obj.room_id};
    });

    this.setState({
      dataSource: ds.cloneWithRows(rows),
    });
  }

  async _onPressRow(userIds, roomId) {
    const me = await Network._fetch({
      path: '/accounts',
      method: 'GET',
    });

    const userId = await me.user_id;

    await Actions.room({title: userIds, roomId: roomId, userId: userId});
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight
        underlayColor='#E5E5E5'
        onPress={() => {
          this._onPressRow(rowData.user_ids, rowData.roomId);
        }}
      >
        <View style={baseStyles.listItem}>
          <Text style={selfStyle.userId}>{rowData.user_ids}</Text>
          <Text style={selfStyle.date}>{rowData.updated_at}</Text>
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
        enableEmptySections={true}
      />
    );
  }
}

const selfStyle = StyleSheet.create({
  userId: {
    alignSelf: 'center',
  },
  date: {
    alignSelf: 'flex-start',
    marginTop: 3,
    marginLeft: 8,
    color: '#797979',
    fontSize: 11,
  }
});