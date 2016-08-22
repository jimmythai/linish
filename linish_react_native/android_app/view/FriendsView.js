import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  StyleSheet,
  TouchableHighlight,
  Alert,
  Vibration,
} from 'react-native';

// import { SwipeListView } from 'react-native-swipe-list-view';

import baseStyles from '../style/base'
import Network from './Network';

export default class FriendsView extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(['r1', 'r2']),
      rowsData: [],
    };

    this.setDataSource();
  }

  async setDataSource() {
    const res = await Network._fetch({
      path: '/friends',
      method: 'GET',
    });

    await this.setState({
      dataSource: this.ds.cloneWithRows(res),
      rowsData: res,
    });
  }

  _onLongPress(rowData, rowID) {
    Vibration.vibrate([0, 10]);
    Alert.alert(
      rowData,
      null,
      [
        {text: '友だちを削除', onPress: () => {this.deleteFriend(rowData, rowID)}}
      ]
    );
  }

  async deleteFriend(rowData, rowID) {
    const res = await Network._fetch({
      path: '/friends/delete',
      method: 'POST',
      body: {
        user_ids: [rowData],
      }
    });

    if(await res.code === 400) {
      return;
    }

    await this.state.rowsData.splice(rowID, 1)

    await this.setState({
      dataSource: this.ds.cloneWithRows(this.state.rowsData),
      rowsData: this.state.rowsData,
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableHighlight
        style={baseStyles.listItem}
        onLongPress={()=> {
          this._onLongPress(rowData, rowID)
        }}
      >
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
        renderSeparator={this._renderSeparator.bind(this)}
        enableEmptySections={true}
      />
    );
  }
}

const selfStyles = StyleSheet.create({

  outPutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  searchBoxArea: {
    position: 'relative',
  },
  searchBox: {
  },
  searchButton: {
    position: 'absolute',
    top: 0,
    right: 0,
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
    marginTop: 20,
  },
});