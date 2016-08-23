// import { ActionCable } from 'actioncable-js';
// import ActionCable from 'actioncable';
import {
  AsyncStorage,
} from 'react-native';

export default class Network {
  constructor() {
  }

  static makeUrl(protocol, path) {
    const HTTP_PROTOCOL = 'http:';
    const WEBSOCKET_PROTOCOL = 'ws:';
    const HOST = '//127.0.0.1:3000';
    const API_DIRECTORY = '/api';
    const API_VERSION = '/v1';
    const WEBSOCKET_DIRECTORY = '/cable';
    let url;

    switch(protocol) {
      case 'http':
        url = HTTP_PROTOCOL + HOST + API_DIRECTORY + API_VERSION + path;
        break;
      case 'ws':
        url = WEBSOCKET_PROTOCOL + HOST + WEBSOCKET_DIRECTORY;
        break;
    }

    return url;
  }

  static makeQueryString() {
    
  }

  static async getAccessToken() {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      return accessToken;
    } catch(err) {
      return '';
    }
  
}
  static async getData(path = '') {
    let url = this.makeUrl('http', path);
    console.log(url)
    const hasAccessToken = !(path === '/accounts/signup' || path === '/accounts/signin');

    if(hasAccessToken) {
      const accessToken = this.getAccessToken();
      url = url + '?access_token=' + accessToken;
    }

    console.log(url)

    return fetch(url).then(function(res) {
      const json = res.json();
      if (!res.ok) {
        console.warn(
          'ResponseError\n',
          {
            status: res.status,
            message: res.statusText,
            responseJson: json,
          }
        );
      }
      return json;
    }); 
  }



  static postData({path = '', body = {}} = {}) {
    let url = this.makeUrl('http', path);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const hasAccessToken = !(path === '/accounts/signup' || path === '/accounts/signin');

    if(hasAccessToken) {
      const accessToken = this.getAccessToken();
      body.access_token = accessToken;
    }

    console.log(url)

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    }).then(function(res) {
      const json = res.json();
      if (!res.ok) {
        console.warn(
          'ResponseError\n',
          {
            status: res.status,
            message: res.statusText,
            responseJson: json,
          }
        );
      }
      return json;
    });
  }

  static _fetch({path = '', method = 'GET', body = {}} = {}) {
    let url = this.makeUrl('http', path);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const hasAccessToken = !(path === '/accounts/signup' || path === '/accounts/signin');
    let res;

    return (async() => {
      try {
        switch(method) {
          case 'GET':
            if(hasAccessToken) {
              const accessToken = await this.getAccessToken();
              url = await url + '?access_token=' + accessToken;
            }
            res = await fetch(url);
            break;

          case 'POST':
            if(hasAccessToken) {
              const accessToken = await this.getAccessToken();
              body.access_token = await accessToken;
            }
            res = await fetch(url, {
              method: method,
              headers: headers,
              body: JSON.stringify(body)
            });
            break;
        }

        const json = await res.json();

        if (!res.ok) {
          await console.warn(
            'ResponseError\n',
            {
              status: res.status,
              message: res.statusText,
              responseJson: json,
            }
          );
        }
        console.log(await json)
        return await json;
      } catch(err) {
        return await err;
      }
    })();
  }

  static connectCable() {
    const url = this.makeUrl('ws');
    const cable = ActionCable.createConsumer(url);
    return cable;
  }
}