//
//  CustomSegue.swift
//  linish_ios
//
//  Created by Atsushi Yamamoto on 7/20/16.
//  Copyright © 2016 Atsushi Yamamoto. All rights reserved.
//

import UIKit

class CustomSegue: UIStoryboardSegue {
    override func perform() {
        let sourceVC: UIViewController = self.sourceViewController
        let destinationVC: UIViewController = self.destinationViewController
        let transition: CATransition = CATransition()
        let timeFunc: CAMediaTimingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut)
        
        transition.duration = 0.25
        transition.timingFunction = timeFunc
        transition.type = kCATransitionPush
        transition.subtype = kCATransitionFromRight
        
        sourceVC.navigationController!.view.layer.addAnimation(transition, forKey: kCATransition)
        sourceVC.navigationController!.pushViewController(destinationVC, animated: false)
    }
}
