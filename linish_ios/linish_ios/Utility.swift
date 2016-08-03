//
//  Regexp.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/19/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Foundation
import Alamofire
import SwiftyJSON

class Regexp {
    let internalRegexp: NSRegularExpression
    let pattern: String

    init(_ pattern: String) {
        self.pattern = pattern
        do {
            self.internalRegexp = try NSRegularExpression(pattern: pattern, options: [])
        } catch let error as NSError {
            print(error.localizedDescription)
            self.internalRegexp = NSRegularExpression()
        }
    }

    func isMatch(input: String) -> Bool {
        let nsString = input as NSString
        let matches = self.internalRegexp.matchesInString(input, options:[], range:NSMakeRange(0, nsString.length))
        return matches.count > 0
    }

    func matches(input: String) -> [String]? {
        if self.isMatch(input) {
            let nsString = input as NSString
            let matches = self.internalRegexp.matchesInString( input, options: [], range:NSMakeRange(0, nsString.length) )
            var results: [String] = []
            for i in 0 ..< matches.count {
                results.append( (input as NSString).substringWithRange(matches[i].range) )
            }
            return results
        }
        return nil
    }
}

class Date {
    class func dateFromString(string: String, format: String, locale: String) -> NSDate {
        let formatter: NSDateFormatter = NSDateFormatter()
        formatter.locale = NSLocale(localeIdentifier: locale)
        formatter.dateFormat = format
        return formatter.dateFromString(string)!
    }
    
    class func stringFromDate(date: NSDate, format: String, locale: String) -> String {
        let formatter: NSDateFormatter = NSDateFormatter()
        formatter.locale = NSLocale(localeIdentifier: locale)
        formatter.dateFormat = format
        return formatter.stringFromDate(date)
    }
}

class API {
    static let hostname: String = "http://192.168.100.179:3000"
    static let subDirectory: String = "/api"
    static let apiVersion: String = "/v1"
    static var data: JSON = ""

    class func makeUrl(path: String) -> String {
        return hostname + subDirectory + apiVersion + path
    }
    
    class func makeUrlWithAccessToken(path: String) -> String {
        return API.makeUrl(path) + "?access_token=" + getAccessToken()
    }
    
    class func getAccessToken() -> String {
        let userDefaults = NSUserDefaults.standardUserDefaults()
        let accessToken = userDefaults.objectForKey("access_token") as! String
        return accessToken
    }

    class func get(path: String, completion : (JSON) -> ()) {
        var url: String = ""

        if path == "/accounts/signin" || path == "/accounts/signup" {
            url = API.makeUrl(path)
        } else {
            url = API.makeUrlWithAccessToken(path)
        }
        
        Alamofire.request(.GET, url)
        .responseJSON { response in
            print(response)
            guard let data = response.result.value else {
                return
            }
            completion(JSON(data))
        }
    }

    class func post(path: String, parameters: [String: AnyObject] = ["": ""], completion : (JSON) -> ()) {
        var requestParameters:[String: AnyObject] = parameters
        if !(path == "/accounts/signin" || path == "/accounts/signup") {
            print("access_Token")
            requestParameters["access_token"] = getAccessToken()
        }
        
        Alamofire.request(.POST, API.makeUrl(path), parameters: requestParameters)
            .responseJSON { response in
                print(response)
                guard let data = response.result.value else {
                    return
                }
                completion(JSON(data))
        }
    }
}


//enum UIBarButtonHiddenItem: Int {
//    case Previous = 101
//    case Next     = 102
//    case Up       = 103
//    case Down     = 104
//    case Locate   = 100
//    case Trash    = 110
//    func convert() -> UIBarButtonSystemItem {
//        return UIBarButtonSystemItem(rawValue: self.rawValue)!
//    }
//}
//
//extension UIBarButtonItem {
//    convenience init(barButtonHiddenItem item:UIBarButtonHiddenItem, target: AnyObject?, action: Selector) {
//        self.init(barButtonSystemItem: item.convert(), target:target, action: action)
//    }
//}


//// HTTP-GET
//func getAsync(sender: AnyObject) {
//    
//    // create the url-request
//    let urlString = "http://httpbin.org/get"
//    var request = NSMutableURLRequest(URL: NSURL(string: urlString)!)
//    
//    // set the method(HTTP-GET)
//    request.HTTPMethod = "GET"
//    
//    // use NSURLSessionDataTask
//    var task = NSURLSession.sharedSession().dataTaskWithRequest(request, completionHandler: { data, response, error in
//        if (error == nil) {
//            var result = NSString(data: data, encoding: NSUTF8StringEncoding)!
//            print(result)
//        } else {
//            print(error)
//        }
//    })
//    task.resume()
//    
//}
//
//// HTTP-POST
//func postAsync(sender: AnyObject) {
//    
//    // create the url-request
//    let urlString = "http://httpbin.org/post"
//    var request = NSMutableURLRequest(URL: NSURL(string: urlString)!)
//    
//    // set the method(HTTP-POST)
//    request.HTTPMethod = "POST"
//    // set the header(s)
//    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
//    
//    // set the request-body(JSON)
//    var params: [String: AnyObject] = [
//        "foo": "bar",
//        "baz": [
//            "a": 1,
//            "b": 20,
//            "c": 300
//        ]
//    ]
//    request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: nil)
//    
//    // use NSURLSessionDataTask
//    var task = NSURLSession.sharedSession().dataTaskWithRequest(request, completionHandler: {data, response, error in
//        if (error == nil) {
//            var result = NSString(data: data, encoding: NSUTF8StringEncoding)!
//            print(result)
//        } else {
//            print(error)
//        }
//    })
//    task.resume()
//    
//}
//
