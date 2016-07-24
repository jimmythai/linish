//
//  ChooseFriendsTableViewCell.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/21/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit

class ChooseFriendsTableViewCell: UITableViewCell {

    @IBOutlet weak var friendUsername: UILabel!
    @IBOutlet weak var tickButton: UIButton!

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
