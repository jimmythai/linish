//
//  SignupViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/19/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class SignupViewController: UIViewController {

    @IBOutlet weak var emailField: UITextField!
    @IBOutlet weak var useridField: UITextField!
    @IBOutlet weak var passwordField: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.hidesBackButton = true
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func signUpAction(sender: AnyObject) {
        let email = self.emailField.text // valid string
        let userid = self.useridField.text // length and valid string
        let password = self.passwordField.text // valid length and valid string
        let finalEmail = email?.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        
        var errors: [String] = []

        let emailRegex = "^[\\w+\\-.]+@[a-z\\d\\-.]+\\.[a-z]+$"

        if email!.isEmpty {
            errors.append("メールアドレスを入力してください")
        } else if !Regexp(emailRegex).isMatch(email!) {
            errors.append("正しいメールアドレスを入力してください")
        }

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
            let alert = UIAlertController(title: "Signup Error", message: error, preferredStyle: UIAlertControllerStyle.Alert)
            let defaultAction: UIAlertAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler:{
                (action: UIAlertAction!) -> Void in
                print("OK")
            })
            alert.addAction(defaultAction)
            presentViewController(alert, animated: true, completion: nil)
            print("CLIENT ERROR")
        } else {
            let parameters = [
                "user_id": userid!,
                "password": password!,
                "email": finalEmail!,
                "uuid": UIDevice.currentDevice().identifierForVendor!.UUIDString
            ]
            
            API.post("/accounts/signup", parameters: parameters) { response in
                self.signoutFromAccount(response)
            }
        }
    }

    func signoutFromAccount(response: JSON) {
        if response["code"] == 400 {
            print("ERROR")
            // TODO refactor!! Make alert utility
            let alert = UIAlertController(title: "Duplicate account", message: "入力したユーザー名またはメールアドレスはすでに登録されています", preferredStyle: UIAlertControllerStyle.Alert)
            let defaultAction: UIAlertAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler:{
                (action: UIAlertAction!) -> Void in
                print("OK")
            })
            alert.addAction(defaultAction)
            self.presentViewController(alert, animated: true, completion: nil)
            return
        } else {
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
