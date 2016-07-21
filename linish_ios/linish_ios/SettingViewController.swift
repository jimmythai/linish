//
//  SettingViewController.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/20/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit

class SettingViewController: UIViewController {

    @IBOutlet weak var settingTableView: UITableView!

    let items:[String] = ["ログアウト", "退会"]

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    @IBAction func cancelToSetting(segue: UIStoryboardSegue) {
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("settingTableViewCell") as! SettingTableViewCell
        cell.settingItem.text = self.items[indexPath.row]
        return cell
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return items.count
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        if indexPath.row == 0 {
            performSegueWithIdentifier("deleteAccountSegue", sender: indexPath.row)
        } else if indexPath.row == 1 {
            performSegueWithIdentifier("signoutSegue", sender: indexPath.row)
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
