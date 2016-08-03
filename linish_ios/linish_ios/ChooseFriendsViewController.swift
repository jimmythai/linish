//
//  ChooseFriendsViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/21/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class ChooseFriendsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    var friends:[String] = []
    var selectedFriends:[String] = []
    var selectedRoom: Int = 0
    var userId: String = ""

    @IBOutlet weak var friendsTableView: UITableView!

    override func viewDidLoad() {
        super.viewDidLoad()
        getFriends()
        self.friendsTableView.delegate = self
        self.friendsTableView.dataSource = self

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "showMessagesFromChooseFriends" {
            let nextVC:MessagesViewController = segue.destinationViewController as! MessagesViewController
            nextVC.selectedRoom = self.selectedRoom
            nextVC.title = self.selectedFriends.joinWithSeparator(",")
            nextVC.userId = self.userId
            setBackButtonForNextPage()
        }
    }

    func getFriends() {
        API.get("/friends") { response in
            for i in 0..<response.count {
                self.friends.append(response[i].string!)
            }
            self.friendsTableView.reloadData()
        }
    }

    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("ChooseFriendsTableViewCell") as! ChooseFriendsTableViewCell
        let userId = self.friends[indexPath.row]
        cell.layoutMargins = UIEdgeInsetsZero
        cell.separatorInset = UIEdgeInsetsZero
        cell.friendUsername.text = userId
        return cell
    }

    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return friends.count
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        let cell = self.friendsTableView.cellForRowAtIndexPath(indexPath)
        let row = indexPath.row
        let userId = self.friends[row]

        if (cell!.accessoryType == UITableViewCellAccessoryType.Checkmark) {
            cell!.accessoryType = UITableViewCellAccessoryType.None
            self.selectedFriends = self.selectedFriends.filter() { $0 != userId }
        } else {
            cell!.accessoryType = UITableViewCellAccessoryType.Checkmark
            selectedFriends.append(userId)
        }
        
        if(self.selectedFriends.count > 0 && (self.navigationItem.rightBarButtonItem) == nil) {
            setOkButton()
        }

        if(self.selectedFriends.count == 0) {
            navigationItem.rightBarButtonItem = nil
        }

        let uiBarButtonTitle = "OK(\(self.selectedFriends.count))"
        navigationItem.rightBarButtonItem?.title = uiBarButtonTitle
    }
    
    func setOkButton() {
        let uiBarButtonItem: UIBarButtonItem = UIBarButtonItem(title: "OK(1)", style: UIBarButtonItemStyle.Plain, target: self, action: #selector(self.createRoom))

        self.navigationItem.setRightBarButtonItems([uiBarButtonItem], animated: true)
    }
    
    func setBackButtonForNextPage() {
//        TODO fix action not working
        let backButton = UIBarButtonItem(title: "Chats", style: UIBarButtonItemStyle.Plain, target: nil, action: #selector(self.tapToChats(_:)))
        self.navigationItem.backBarButtonItem = backButton
    }
    
    func tapToChats(sender: UIBarButtonItem) {
        self.performSegueWithIdentifier("unwindToChatsFromMessages", sender: self)
    }
    
    func createRoom() {
        let parameters = [
            "member_ids": self.selectedFriends
        ]

        API.post("/rooms/create", parameters: parameters) { response in
            print("HOGEHGOEHGOEHGOEG")
            print(response["room_id"])
            print("FUFEFEUFUEFUE")
            self.selectedRoom = response["room_id"].intValue
            self.userId = response["user_id"].string!
            self.performSegueWithIdentifier("showMessagesFromChooseFriends", sender: self)
        }
    }

}
