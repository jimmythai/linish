//
//  AddFriendViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/22/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class AddFriendViewController: UIViewController {

    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var errorMessage: UILabel!
    @IBOutlet weak var addFriendButton: UIButton!
    @IBOutlet weak var findFriendButton: UIButton!
    @IBOutlet weak var findFriendTextField: UITextField!

    @IBAction func findFriend(sender: UIButton) {
        let userId = self.findFriendTextField.text?.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        if !(userId?.isEmpty ?? true) {
            Alamofire.request(.GET, "http://localhost:3000/api/v1/accounts/\(userId!)")
                .responseJSON { response in
                    let json = JSON(response.result.value!)
                    if json["code"] == 400 {
                        self.errorMessage.text = json["error"].string
                        self.errorMessage.hidden = false
                    } else {
                        self.userName.text = userId
                        self.userName.hidden = false
                        self.addFriendButton.hidden = false
                    }
            }
            
            API.get("/accounts/\(userId!)") { response in
                if response["code"] == 400 {
                    self.errorMessage.text = response["error"].string
                    self.errorMessage.hidden = false
                } else {
                    self.userName.text = userId
                    self.userName.hidden = false
                    self.addFriendButton.hidden = false
                }
            }
        }
    }
    @IBAction func addFriend(sender: UIButton) {
        let parameters = [
            "followed_id": userName.text!
        ]

        API.post("/friends/add", parameters: parameters) { response in
            if response["code"] == 400 {
                self.errorMessage.text = response["error"].string
                self.errorMessage.hidden = false
            } else {
                self.performSegueWithIdentifier("unwindToFriendsFromAddFriends", sender: self)
            }
        }
    }
    @IBAction func findFriendChange(sender: UITextField) {
        if self.findFriendTextField.text?.isEmpty ?? true {
            self.findFriendButton.tintColor = UIColor.blueColor()
        } else {
            self.findFriendButton.tintColor = UIColor.redColor()
        }

        if(!self.userName.hidden) {
            self.userName.hidden = true
        }
        if(!self.addFriendButton.hidden) {
            self.addFriendButton.hidden = true
        }
        if(!self.errorMessage.hidden) {
            self.errorMessage.hidden = true
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        self.userName.hidden = true
        self.addFriendButton.hidden = true
        self.errorMessage.hidden = true

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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