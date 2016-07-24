//
//  DeleteAccountViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/20/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit
import Alamofire

class DeleteAccountViewController: UIViewController {

    
    @IBAction func deleteButton(sender: UIButton) {
        deleteButtonTapped(sender)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func deleteButtonTapped(sender: UIButton) {
        API.post("/accounts/delete") { response in
            self.navigationController?.popViewControllerAnimated(true)
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
