import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ListView,
  TouchableHighlight,
  // LayoutAnimation,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import baseStyles from '../style/base';
import settingStyles from '../style/setting';
import Network from './Network';

export default class ChooseFriendsView extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows(['r1', 'r2']),
      rowsData: [],
      selectedRows: [],
    };
  }

  async componentWillMount() {
    // LayoutAnimation.configureNext({
    //   duration: 100000,
    // })
    // LayoutAnimation.easeInEaseOut();

    const res = await Network._fetch({
      path: '/friends',
      method: 'GET',
    });

    const rowsData = await res.map(function(userId) {
        let rowData = {};
        rowData.userId = userId;
        rowData.selected = false;
        return rowData;
    });

    await this.setDataSource(rowsData);
  }

  async onRightChooseFriends() {
    const selectedRows = this.shouldReturnSelectedRows();
    const users = selectedRows.map(function(obj) {
      return obj.userId;
    });

    const res = await Network._fetch({
      path: '/rooms/create',
      method: 'POST',
      body: {
        member_ids: users,
      }
    });

    const me = await Network._fetch({
      path: '/accounts',
      method: 'GET',
    });

    const title = await users.join(',');
    const roomId = await res.room_id;
    const userId = await me.user_id
    await Actions.room({title: title, roomId: roomId, userId: userId});
  }

  shouldReturnSelectedRows() {
    const selectedRows = this.state.rowsData.filter(function(element, index, array) {
      if(element.selected) {
        return element;
      }
    });
    return selectedRows;
  }

  setDataSource(rowsData) {
    this.setState({
      dataSource: this.ds.cloneWithRows(rowsData),
      rowsData: rowsData,
    });
  }

  _onPress(rowID) {
    let rowsData = this.state.rowsData;
    let rowData = rowsData[rowID];

    if(rowData.selected) {
      rowData.selected = false;
    } else {
      rowData.selected = true;
    }
    rowsData[rowID] = rowData;

    this.setDataSource(rowsData);

    const selectedRows = this.shouldReturnSelectedRows();
    const selectedRowsLength = selectedRows.length;
    if(selectedRowsLength > 0) {
      Actions.refresh({rightTitle: 'OK(' + selectedRowsLength + ')', rightButtonTextStyle: {color: '#FFFFFF'}, onRight: () => {this.onRightChooseFriends();}});
    } else {
      Actions.refresh({rightButtonTextStyle: {color: 'transparent'}, onRight: () => {this.onRightChooseFriends();}});
    }
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    return (

      <TouchableHighlight
        underlayColor='#E5E5E5'
        onPress={() => {
            this._onPress(rowID);
        }}
      >
        <View
          style={[baseStyles.listItem, selfStyles.row]}
        >
          <Text>{rowData.userId}</Text>
          <Text style={[selfStyles.checkMark, rowData.selected ? selfStyles.selected : selfStyles.unselected]}>✔︎</Text>
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
      <View style={[baseStyles.wrapper, baseStyles.wrapperForNavigator]}>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={this._renderSeparator}
            enableEmptySections={true}
        />
      </View>
    );
  }
}

const selfStyles = StyleSheet.create({
  buttonsContainer: {
    marginTop: 60,
  },

  row: {
    position: 'relative',
  },
  checkMark: {
    position: 'absolute',
    right: 10,
    top: 8,
    fontSize: 18,
  },
  selected: {
    color: '#3B82FD',
  },
  unselected: {
    color: 'transparent',
  },

//   checkBack: {
//     position: 'absolute',
//     top: 9,
//     right: 6,
//     width: 5,
//     height: 10,
//     backgroundColor: 'black',
//     transform: [{rotate: '45deg'}]
//   },
//   checkForward: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     width: 10,
//     height: 10,
//     backgroundColor: 'white',
//     transform: [{rotate: '45deg'}]
//   },
});