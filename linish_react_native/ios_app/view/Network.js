import ActionCable from 'actioncable';
import {
  AsyncStorage,
} from 'react-native';

export default class Network {
  constructor() {
    this.HTTP_PROTOCOL = 'http:';
    this.WEBSOCKET_PROTOCOL = 'ws:';
    this.HOST = '//192.168.100.103:3000';
    this.API_DIRECTORY = '/api';
    this.API_VERSION = '/v1';
    this.WEBSOCKET_DIRECTORY = '/cable';
  }
  
  static makeUrl(protocol, path) {
    const nw = new Network();
    let url;

    switch(protocol) {
      case 'http':
        url = nw.HTTP_PROTOCOL + nw.HOST + nw.API_DIRECTORY + nw.API_VERSION + path;
        break;
      case 'ws':
        url = nw.WEBSOCKET_PROTOCOL + nw.HOST + nw.WEBSOCKET_DIRECTORY;
        break;
    }
    return url;
  }


  static makeQueryString() {
    
  }

  static async getAccessToken() {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      console.log(accessToken)
      return accessToken;
    } catch(err) {
      return '';
    }
  }
  
  // static _fetch({path = '', method = 'GET', body = {}} = {}) {
  //   const url = this.makeUrl('http', path);
  //   const headers = {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //   };
  //   let res;

  //   switch(method) {
  //     case 'GET':
  //       res = fetch(url);
  //       break;
  //     case 'POST':
  //       res = fetch(url, {
  //         method: method,
  //         headers: headers,
  //         body: JSON.stringify(body)
  //       }).then((res) => {
  //         if (res.ok) {
  //           return console.error('STATUS: ' + res.status + ', MESSAGE: ' + res.statusText); 
  //         }
  //         return res;
  //       }).catch((err) => {
  //         console.error(err);
  //         return err;
  //       });
  //       break;
  //   }

  //   return res;
  // }

  static async _fetch({path = '', method = 'GET', body = {}} = {}) {
    let url = this.makeUrl('http', path);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const hasAccessToken = !(path === '/accounts/signup' || path === '/accounts/signin');
    let res;

    try {
      switch(method) {
        case 'GET':
          if(hasAccessToken) {
            const accessToken = await this.getAccessToken();
            url = url + '?access_token=' + accessToken;
          }
          console.log(url)
          res = await fetch(url);
          break;

        case 'POST':
          if(hasAccessToken) {
            const accessToken = await this.getAccessToken();
            body.access_token = accessToken;
          }
          res = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(body)
          });
          break;
      }
      if (!res.ok) {
        await console.warn('ResponseError\nstatus: ' + res.status + ', message: ' + res.statusText, ', json: ' + res.json());
      }
      return await res;
    } catch(err) {
      console.error(err);
      return await err;
    }
  }

  static connectCable(channel) {
    const nw = new Network();
    const url = this.makeUrl('ws');
    const cable = ActionCable.createConsumer(url);
    
    cable.subscriptions.create(channel, {
      // normal channel code goes here...
    });
  }
}