//
//  MessagesViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/20/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import JSQMessagesViewController
import Alamofire
import SwiftyJSON
import Starscream
import ActionCableClient

class MessagesViewController: JSQMessagesViewController {
//class MessagesViewController: JSQMessagesViewController, WebSocketDelegate {
//    let socket = WebSocket(url: NSURL(string: "ws://127.0.0.1:3000/cable")!, protocols: ["messages"])
    
    let incomingBubble = JSQMessagesBubbleImageFactory().incomingMessagesBubbleImageWithColor(UIColor(red:1.00, green:1.00, blue:1.00, alpha:1.00))
    let outgoingBubble = JSQMessagesBubbleImageFactory().outgoingMessagesBubbleImageWithColor(UIColor(red:0.53, green:0.90, blue:0.29, alpha:1.00))
    var messages = [JSQMessage]()
    
    var selectedRoom:Int = 0
    var userId:String = ""
    var client = ActionCableClient(URL: NSURL(string: "ws://127.0.0.1:3000/cable")!)
//    var firstLayout = true
    
    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

        self.view.layoutIfNeeded()
//        self.collectionView.collectionViewLayout.invalidateLayout()
//        
//        dispatch_async(dispatch_get_main_queue(), {
//            self.firstLayout = false
//        })
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        
//        if firstLayout {
//            self.scrollToBottomAnimated(false)
//        }
    }


    override func viewDidLoad() {
        super.viewDidLoad()
        self.collectionView.backgroundColor = UIColor(red:0.54, green:0.64, blue:0.77, alpha:1.00);
        self.setup()
        self.addDemoMessages()
        self.receiveRealTimeMessage()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    func reloadMessagesView() {
        self.collectionView?.reloadData()
    }

    func addDemoMessages() {
        API.get("/rooms/\(self.selectedRoom)/messages") { response in
            self.showMessages(response)
        }
    }

    func showMessages(response: JSON) {
        for (index,message):(String, JSON) in response["messages"] {
            let sender = message["user_id"].string
            let messageContent = message["message"].string
            let message = JSQMessage(senderId: sender, displayName: sender, text: messageContent)
            self.messages += [message]
        }
        self.reloadMessagesView()
    }

    func setup() {
        self.senderId = self.userId
        self.senderDisplayName = self.userId
        self.inputToolbar.contentView.leftBarButtonItem = nil
    }
    
    
    func receiveRealTimeMessage() {
        let roomChannel = self.client.create("MessageChannel", identifier: nil, autoSubscribe: true, bufferActions: false)
        
        roomChannel.onReceive = { (JSON : AnyObject?, error : ErrorType?) in
            print("Received", JSON, error)
            let sender = JSON!["user_id"]!! as! String
            let messageBody = JSON!["message"]!! as! String
            let roomId = JSON!["room_id"]!!.integerValue
            print(self.selectedRoom)
            print(roomId)
            
            if(self.selectedRoom == roomId) {
                let message = JSQMessage(senderId: sender, displayName: sender, text: messageBody)
                self.messages += [message]
                self.finishSendingMessage()
            }
        }
        
        // A channel has successfully been subscribed to.
        roomChannel.onSubscribed = {
            print("Yay!")
        }
        
        // A channel was unsubscribed, either manually or from a client disconnect.
        roomChannel.onUnsubscribed = {
            print("Unsubscribed")
        }
        
        // The attempt at subscribing to a channel was rejected by the server.
        roomChannel.onRejected = {
            print("Rejected")
        }
        
        client.onConnected = {
            print("Connected!")
        }
        
        client.onDisconnected = {(error: ErrorType?) in
            print("Disconnected!")
        }
        client.connect()
    }
    
    override func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return self.messages.count
    }
    
    override func collectionView(collectionView: JSQMessagesCollectionView!, messageDataForItemAtIndexPath indexPath: NSIndexPath!) -> JSQMessageData! {
        let data = self.messages[indexPath.row]
        return data
    }
    
    override func collectionView(collectionView: JSQMessagesCollectionView!, didDeleteMessageAtIndexPath indexPath: NSIndexPath!) {
        self.messages.removeAtIndex(indexPath.row)
    }
    
    override func collectionView(collectionView: JSQMessagesCollectionView!, messageBubbleImageDataForItemAtIndexPath indexPath: NSIndexPath!) -> JSQMessageBubbleImageDataSource! {
        let data = messages[indexPath.row]
        switch(data.senderId) {
        case self.senderId:
            return self.outgoingBubble
        default:
            return self.incomingBubble
        }
    }
    
    override func collectionView(collectionView: JSQMessagesCollectionView!, avatarImageDataForItemAtIndexPath indexPath: NSIndexPath!) -> JSQMessageAvatarImageDataSource! {
        return nil
    }
    
    override func didPressSendButton(button: UIButton!, withMessageText text: String!, senderId: String!, senderDisplayName: String!, date: NSDate!) {
        let parameters = [
            "message": text
        ]
        
        API.post("/rooms/\(self.selectedRoom)/messages/add", parameters: parameters) { response in
//            let message = JSQMessage(senderId: senderId, senderDisplayName: senderDisplayName, date: date, text: text)
//            self.messages += [message]
//            self.finishSendingMessage()
        }
    }
    
    override func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        
        let cell: JSQMessagesCollectionViewCell = (super.collectionView(collectionView, cellForItemAtIndexPath: indexPath) as! JSQMessagesCollectionViewCell)
        cell.textView!.textColor = UIColor(red:0.12, green:0.20, blue:0.19, alpha:1.00)
        return cell
    }
    
    override func didPressAccessoryButton(sender: UIButton!) {
        
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
