//
//  SigninTableViewCell.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/16/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit

class SigninTableViewCell: UITableViewCell {

    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
