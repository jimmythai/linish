//
//  FriendsTableViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/19/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
// TODO: delete
import Starscream
import ActionCableClient

class FriendsTableViewController: UITableViewController {
    
    @IBOutlet weak var friendListTableView: UITableView!
    
    @IBAction func unwindToFriends(segue: UIStoryboardSegue) {
    }

    var friends:[String] = []
    var client = ActionCableClient(URL: NSURL(string: "ws://192.168.100.179:3000/cable")!)

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewDidAppear(animated: Bool) {
        super.viewDidAppear(animated)
        getFriends()
        getUserAccount()
    }
    
    override func viewWillDisappear(animated: Bool) {
        super.viewDidDisappear(animated)
        client.disconnect()
    }

    func getFriends() {
        API.get("/friends") { response in
            self.showFriends(response)
        }
    }

    func showFriends(response: JSON) {
        self.friends = []
        for i in 0..<response.count {
            self.friends.append(response[i].string!)
        }
        self.friendListTableView.reloadData()
    }

    func getUserAccount() {
        API.get("/accounts") { response in
            let userId = response["user_id"].string!
            self.receiveRealTimeFriends(userId)
            self.receiveRealTimeDeletingFriends(userId)
            self.client.connect()
        }
    }

    func receiveRealTimeFriends(userId: String) {
        let friendsChannel = self.client.create("FriendsChannel", identifier: nil, autoSubscribe: true, bufferActions: false)

        friendsChannel.onReceive = { (json : AnyObject?, error : ErrorType?) in
            let followerId = json!["follower_id"] as! String
            let followedId = json!["followed_id"] as! String

            if(followedId == userId) {
                self.friends.append(followerId)
                self.friends.sortInPlace { $0 < $1 }
                self.friendListTableView.reloadData()
            }
        }

        // A channel has successfully been subscribed to.
        friendsChannel.onSubscribed = {
            print("Yay!")
        }
        
        // A channel was unsubscribed, either manually or from a client disconnect.
        friendsChannel.onUnsubscribed = {
            print("Unsubscribed")
        }
        
        // The attempt at subscribing to a channel was rejected by the server.
        friendsChannel.onRejected = {
            print("Rejected")
        }
        
        client.onConnected = {
            print("Connected!")
        }
        
        client.onDisconnected = {(error: ErrorType?) in
            print("Disconnected!")
        }
    }
    
    
    func receiveRealTimeDeletingFriends(userId: String) {
        let friendsDeleteChannel = self.client.create("FriendsDeleteChannel", identifier: nil, autoSubscribe: true, bufferActions: false)
        
        friendsDeleteChannel.onReceive = { (json : AnyObject?, error : ErrorType?) in
            let deletingId = json!["deleting_id"] as! String
            let deletedId = json!["deleted_id"] as! String
            print(deletedId)
            print(userId)
            print(self.friends)
            
            if(deletedId == userId) {
                if let index = self.friends.indexOf(deletingId) {
                    self.friends.removeAtIndex(index)
                    self.friendListTableView.reloadData()
                }
            }
        }
        
        // A channel has successfully been subscribed to.
        friendsDeleteChannel.onSubscribed = {
            print("Yay!")
        }
        
        // A channel was unsubscribed, either manually or from a client disconnect.
        friendsDeleteChannel.onUnsubscribed = {
            print("Unsubscribed")
        }
        
        // The attempt at subscribing to a channel was rejected by the server.
        friendsDeleteChannel.onRejected = {
            print("Rejected")
        }
        
        client.onConnected = {
            print("Connected!")
        }
        
        client.onDisconnected = {(error: ErrorType?) in
            print("Disconnected!")
        }
    }
    
    
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("friendListItem") as! FriendListTableViewCell
        let row = self.friends[indexPath.row]
        cell.layoutMargins = UIEdgeInsetsZero
        cell.separatorInset = UIEdgeInsetsZero
        cell.friendUsername.text = row
        return cell
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return friends.count
    }
    
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        let row = indexPath.row
        let friend = self.friends[row]
        let parameters = [
            "user_ids": [friend]
        ]

        API.post("/friends/delete", parameters: parameters) { response in
            if response["code"] == 400 {
                return
            } else {
                self.friends.removeAtIndex(row)
                tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Automatic)
            }
        }
    }

    
    // MARK: - Table view data source

    /*
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("reuseIdentifier", forIndexPath: indexPath)

        // Configure the cell...

        return cell
    }
    */

    /*
    // Override to support conditional editing of the table view.
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == .Delete {
            // Delete the row from the data source
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(tableView: UITableView, moveRowAtIndexPath fromIndexPath: NSIndexPath, toIndexPath: NSIndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(tableView: UITableView, canMoveRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}

