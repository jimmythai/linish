import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
  StyleSheet,
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
    console.log(props)
  }

  componentWillReceiveProps(props) {
    console.log(props);
  }

  componentWillUpdate() {
    console.log(this.refs)
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
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
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