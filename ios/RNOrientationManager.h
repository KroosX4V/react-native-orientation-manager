#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNOrientationManager : RCTEventEmitter <RCTBridgeModule>
+ (UIInterfaceOrientationMask)getSupportedInterfaceOrientations;
@end
