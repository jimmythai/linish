import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  StyleSheet,
  StatusBar,
} from 'react-native';

// import { SwipeListView } from 'react-native-swipe-list-view';

import baseStyles from '../style/base'
import Network from './Network';

export default class FriendsView extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['r1', 'r2']),
    };

    this.setDataSource(ds);
  }

  componentWillReceiveProps(props) {
    console.log(props);
  }

  componentWillUpdate() {
    console.log('componentWillUpdate')
  }

  async setDataSource(ds) {
    const res = await Network._fetch({
      path: '/friends',
      method: 'GET',
    });

    this.setState({
      dataSource: ds.cloneWithRows(res),
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (
      <View style={baseStyles.listItem}>
        <Text>{rowData}</Text>
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
      <View>
        <StatusBar
          barStyle="light-content"
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          enableEmptySections={true}
          style={selfStyles.list}
        />
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  list: {
    marginBottom: 62,
  },
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