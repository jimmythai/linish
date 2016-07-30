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


class SigninViewController: UIViewController {

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

        // Do any additional setup after loading the view.
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
