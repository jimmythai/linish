//
//  SignoutViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/21/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire

class SignoutViewController: UIViewController {

    @IBAction func signoutButton(sender: UIButton) {
        signoutButtonTapped(sender)
    }
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func signoutButtonTapped(sender: UIButton) {
        API.post("/accounts/signout") { response in
            self.performSegueWithIdentifier("signoutCompletedSegue", sender: sender)
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        let nextVC = segue.destinationViewController as UIViewController
        nextVC.title = "ログイン"
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
