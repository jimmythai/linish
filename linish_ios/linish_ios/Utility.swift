//
//  Regexp.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/19/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import Foundation

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
