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

class AddFriendViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var userName: UILabel!
    @IBOutlet weak var errorMessage: UILabel!
    @IBOutlet weak var addFriendButton: UIButton!
    @IBOutlet weak var findFriendButton: UIButton!
    @IBOutlet weak var findFriendTextField: UITextField!

    @IBAction func findFriend(sender: UIButton) {
        let userId = self.findFriendTextField.text?.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
        if !(userId?.isEmpty ?? true) {
            API.get("/accounts/" + userId!) { response in
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
            let magnifierImage = UIImage(named: "MagnifierIcon")
            self.findFriendButton.setImage(magnifierImage, forState: .Normal)
        } else {
            let magnifierImageGreen = UIImage(named: "MagnifierIconGreen")
            self.findFriendButton.setImage(magnifierImageGreen, forState: .Normal)
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
    
//    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
//        if segue.identifier == "showMessagesFromChats" {
//            let nextVC:MessagesViewController = segue.destinationViewController as! MessagesViewController
//            nextVC.selectedRoom = self.selectedRoom
//            nextVC.title = self.selectedMembers
//            nextVC.userId = self.userId
//        }
//    }

    override func viewDidLoad() {
        super.viewDidLoad()
        self.userName.hidden = true
        self.addFriendButton.hidden = true
        self.errorMessage.hidden = true
        
        findFriendTextField.delegate = self
        self.view.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(self.dismissKeyboard)))
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func dismissKeyboard() {
        findFriendTextField.resignFirstResponder()
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        findFriendTextField.resignFirstResponder()
        return true
    }
}
