//
//  SigninViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/16/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class SigninViewController: UIViewController, UITextFieldDelegate {


    @IBOutlet weak var useridField: UITextField!
    @IBOutlet weak var passwordField: UITextField!
    
    @IBAction func unwindToSignin(segue: UIStoryboardSegue) {
        
    }
    
    override func viewWillAppear(animated: Bool) {
        if let tabBarController = self.tabBarController {
            tabBarController.tabBar.hidden = true
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.hidesBackButton = true
        
        
        useridField.delegate = self
        passwordField.delegate = self
        self.view.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(self.dismissKeyboard)))
    }
    
    func dismissKeyboard() {
        useridField.resignFirstResponder()
        passwordField.resignFirstResponder()
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        useridField.resignFirstResponder()
        passwordField.resignFirstResponder()
        return true
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func signInAction(sender: AnyObject) {
        let userid = self.useridField.text // length and valid string
        let password = self.passwordField.text // valid length and valid string
        
        var errors: [String] = []

        if userid!.isEmpty {
            errors.append("ユーザーIDを入力してください")
        } else if userid!.characters.count >= 25 {
            errors.append("ユーザーIDは25文字以内で入力してください")
        }
        
        if password!.isEmpty {
            errors.append("パスワードを入力してください")
        } else if password!.characters.count < 8 || password!.characters.count >= 100 {
            errors.append("パスワードは8文字以上100文字以内で入力してください")
        }
        
        if !errors.isEmpty {
            let error = errors.joinWithSeparator("\n")
            let alert = UIAlertController(title: "Login Error", message: error, preferredStyle: UIAlertControllerStyle.Alert)
            let defaultAction: UIAlertAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler:{
                (action: UIAlertAction!) -> Void in
            })
            alert.addAction(defaultAction)
            presentViewController(alert, animated: true, completion: nil)
        } else {
            let parameters = [
                "user_id": userid!,
                "password": password!
            ]

            API.post("/accounts/signin", parameters: parameters) { response in
                self.signinToAcount(response)
            }
        }
    }

    func connectToWebSocket() {
//        var messageNum = 0
//        let ws = WebSocket()
//        ws.open("ws://127.0.0.1:3000/cable")  // or, reopen the socket to a new url
//        let send : ()->() = {
//            let msg = "\(messageNum+=1): \(NSDate().description)"
//            print("send: \(msg)")
//            ws.send(msg)
//        }
//        ws.event.open = {
//            print("opened")
//            send()
//        }
//        ws.event.close = { code, reason, clean in
//            print("close")
//        }
//        ws.event.error = { error in
//            print("error \(error)")
//        }
//        ws.event.message = { message in
//            if let text = message as? String {
//                print("recv: \(text)")
//                if messageNum == 10 {
//                    ws.close()
//                } else {
//                    send()
//                }
//            }
//        }
    }
    
//    func connectToActionCable() {
//        let client = ActionCableClient(URL: NSURL(string: "ws://127.0.0.1:3000/cable")!)
//        
//        // Connect!
//        client.connect()
//        
//        print(client.debugDescription)
//        
//        client.onConnected = {
//            print("Connected!")
//        }
//        
//        client.onDisconnected = {(error: ErrorType?) in
//            print("Disconnected!")
//        }
//    }

    func signinToAcount(response: JSON) {
        if (response["code"] == 400) {
            let alert = UIAlertController(title: "Login Failure", message: "ユーザーIDまたはパスワードが違います", preferredStyle: UIAlertControllerStyle.Alert)
            let defaultAction: UIAlertAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler:{
                (action: UIAlertAction!) -> Void in
            })
            alert.addAction(defaultAction)
            self.presentViewController(alert, animated: true, completion: nil)
        } else {
            let userDefaults = NSUserDefaults.standardUserDefaults()
            print(response["access_token"])
            userDefaults.setObject(response["access_token"].string, forKey: "access_token")
            userDefaults.synchronize()

            let appDelegate = UIApplication.sharedApplication().delegate! as! AppDelegate
            let initialViewController = self.storyboard!.instantiateViewControllerWithIdentifier("MainTabBarViewController") as UIViewController
            appDelegate.window?.rootViewController = initialViewController
            appDelegate.window?.makeKeyAndVisible()
        }
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
