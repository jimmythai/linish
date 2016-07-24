//
//  ChatsTableViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/19/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class ChatsTableViewController: UITableViewController {
    var rooms = [[String: String?]]()
    var selectedRoom: Int = 0
    var selectedMembers: String = ""
    var userId: String = ""

    @IBOutlet weak var chatListTableView: UITableView!
    
    @IBAction func unwindToChats(segue: UIStoryboardSegue) {
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        self.chatListTableView.contentInset = UIEdgeInsetsMake(0, -15, 0, 0);
        self.chatListTableView.dataSource = self
        
        // TODO add message and image in this API
        API.get("/rooms") { response in
            self.showRooms(response)
        }
        getUserId()
    }

    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("chatListItem") as! ChatListTableViewCell
        let row = self.rooms[indexPath.row]
        cell.chatDate.text = row["date"]!!
        cell.chatMembers.text = row["roomMembers"]!!
        return cell
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return rooms.count
    }
    
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        let rowNumber = indexPath.row
        let row = self.rooms[rowNumber]
        let parameters = [
            "room_ids": [Int(row["roomId"]!!)!]
        ]

        API.post("/rooms/delete", parameters: parameters) { response in
            if response["code"] == 400 {
                return
            } else {
                self.rooms.removeAtIndex(rowNumber)
                tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Automatic)
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        let row = self.rooms[indexPath.row]
        self.selectedRoom = Int(row["roomId"]!!)!
        self.selectedMembers = row["roomMembers"]!!
        self.performSegueWithIdentifier("showMessagesFromChats", sender: self)
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "showMessagesFromChats" {
            let nextVC:MessagesViewController = segue.destinationViewController as! MessagesViewController
            nextVC.selectedRoom = self.selectedRoom
            nextVC.title = self.selectedMembers
            nextVC.userId = self.userId
        }
    }
    
    func showRooms(response: JSON) {
        response.forEach {(_, response) in
            var roomMembers: [String] = []
            if let roomMembersJSON = response["user_ids"].array {
                for roomMemberJSON in roomMembersJSON {
                    roomMembers.append(roomMemberJSON.string!)
                }
            }
            var roomMembersString:String = "Empty room"
            if (!roomMembers.isEmpty) {
                roomMembersString = roomMembers.joinWithSeparator(", ")
            }
            
            let updatedAt: String = response["updated_at"].string!.stringByReplacingOccurrencesOfString("T", withString: " ")
            let substringedUpdatedAt = updatedAt.substringToIndex(updatedAt.endIndex.advancedBy(-5))
            let dateFormat = "yy/M/dd H:mm:ss"
            let date = Date.dateFromString(substringedUpdatedAt, format: dateFormat, locale: "en_US_POSIX")
            let dateString = Date.stringFromDate(date, format: dateFormat, locale: "en_US_POSIX")

            let room: [String: String?] = [
                "roomId": String(response["room_id"]),
                "date": dateString,
                "roomMembers": roomMembersString
            ]
            self.rooms.append(room)
        }
        self.chatListTableView.reloadData()
    }

    func getUserId() {
        API.get("/accounts?uuid=\(UIDevice.currentDevice().identifierForVendor!.UUIDString)") { response in
            let userId = response["user_id"].string!
            self.userId = userId
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
