#import "RNOrientationManager.h"

@implementation RNOrientationManager

{
    bool interfaceOrientationChangedListenerAdded;
    bool deviceOrientationChangedListenerAdded;

    UIInterfaceOrientation lastInterfaceOrientation;
    UIDeviceOrientation lastDeviceOrientation;

    bool settingInterfaceOrientation;
}

static UIInterfaceOrientationMask defaultSupportedInterfaceOrientations = 0;
static UIInterfaceOrientationMask currentSupportedInterfaceOrientations = 0;

+ (void)initialize
{
    if (self != [RNOrientationManager class]) return;

    for (NSString *orientation in [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UISupportedInterfaceOrientations"])
    {
        if ([orientation isEqualToString:@"UIInterfaceOrientationPortrait"])
        {
            defaultSupportedInterfaceOrientations |= UIInterfaceOrientationMaskPortrait;
        }
        else if ([orientation isEqualToString:@"UIInterfaceOrientationPortraitUpsideDown"])
        {
            defaultSupportedInterfaceOrientations |= UIInterfaceOrientationMaskPortraitUpsideDown;
        }
        else if ([orientation isEqualToString:@"UIInterfaceOrientationLandscapeLeft"])
        {
            defaultSupportedInterfaceOrientations |= UIInterfaceOrientationMaskLandscapeLeft;
        }
        else if ([orientation isEqualToString:@"UIInterfaceOrientationLandscapeRight"])
        {
            defaultSupportedInterfaceOrientations |= UIInterfaceOrientationMaskLandscapeRight;
        }
    }

    if (!defaultSupportedInterfaceOrientations) defaultSupportedInterfaceOrientations = UIInterfaceOrientationMaskAll;
    currentSupportedInterfaceOrientations = defaultSupportedInterfaceOrientations;
}

+ (bool)requiresMainQueueSetup
{
    return true;
}

+ (UIInterfaceOrientationMask)getSupportedInterfaceOrientations
{
    return currentSupportedInterfaceOrientations;
}

+ (void)fulfillPromise:(id (^)(void))block resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
    bool resolved = false;
  
    @try
    {
        resolve(block());
        resolved = true;
    }
    @finally
    {
        if (!resolved) reject(@"OperationException", @"An unexpected error occurred on the native side", nil);
    }
}

- (instancetype)init
{
    if (self = [super init])
    {
        interfaceOrientationChangedListenerAdded = false;
        deviceOrientationChangedListenerAdded = false;

        lastInterfaceOrientation = [self getInterfaceOrientation];
        lastDeviceOrientation = [self getDeviceOrientation];

        settingInterfaceOrientation = false;
    }

    return self;
}

- (void)dealloc
{
    if (deviceOrientationChangedListenerAdded) [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSDictionary *)constantsToExport
{
    return @{
        @"initialInterfaceOrientationValue": [self interfaceOrientationToModuleValue:lastInterfaceOrientation],
        @"initialDeviceOrientationValue": [self deviceOrientationToModuleValue:lastDeviceOrientation],
    };
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"interfaceOrientationChanged", @"deviceOrientationChanged"];
}

- (void)addListener:(NSString *)eventName
{
    [super addListener:eventName];
  
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            if ([eventName isEqualToString:@"interfaceOrientationChanged"])
            {
                self->interfaceOrientationChangedListenerAdded = true;
                [self sendInterfaceOrientationChangedIfOccurred];
            }
            // @note: At this point eventName must be "deviceOrientationChanged". So, no need to check.
            else
            {
                [
                    [NSNotificationCenter defaultCenter]
                    addObserver:self selector:@selector(deviceOrientationDidChange:) name:UIDeviceOrientationDidChangeNotification object:nil
                ];

                self->deviceOrientationChangedListenerAdded = true;
                [self sendDeviceOrientationChangedIfOccurred];
            }
        }
    ];
}

- (void)deviceOrientationDidChange:(NSNotification *)notification
{
    if (settingInterfaceOrientation) return;

    [self sendInterfaceOrientationChangedIfOccurred];
    [self sendDeviceOrientationChangedIfOccurred];
}

- (bool)sendInterfaceOrientationChangedIfOccurred
{
    return [self sendInterfaceOrientationChangedIfOccurred:[self getInterfaceOrientation]];
}

- (bool)sendInterfaceOrientationChangedIfOccurred:(UIInterfaceOrientation)orientation
{
    if (!interfaceOrientationChangedListenerAdded) return true;
    if (orientation == lastInterfaceOrientation) return false;

    lastInterfaceOrientation = orientation;
    [self sendEventWithName:@"interfaceOrientationChanged" body:@{@"interfaceOrientationValue": [self interfaceOrientationToModuleValue:orientation]}];
    
    return true;
}

- (void)sendDeviceOrientationChangedIfOccurred
{
    if (!deviceOrientationChangedListenerAdded) return;

    UIDeviceOrientation deviceOrientation = [self getDeviceOrientation];
    if (deviceOrientation == lastDeviceOrientation) return;

    lastDeviceOrientation = deviceOrientation;
    [self sendEventWithName:@"deviceOrientationChanged" body:@{@"deviceOrientationValue": [self deviceOrientationToModuleValue:deviceOrientation]}];
}

RCT_EXPORT_MODULE(OrientationManagerModule);

RCT_EXPORT_METHOD(lockToPortrait:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [self setSupportedInterfaceOrientations:UIInterfaceOrientationMaskPortrait supposedNewInterfaceOrientation:UIInterfaceOrientationPortrait];
                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

RCT_EXPORT_METHOD(lockToPortraitUpsideDown:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [
                        self
                        setSupportedInterfaceOrientations:UIInterfaceOrientationMaskPortraitUpsideDown
                        supposedNewInterfaceOrientation:UIInterfaceOrientationPortraitUpsideDown
                    ];

                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

RCT_EXPORT_METHOD(lockToLandscape:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [self setSupportedInterfaceOrientations:UIInterfaceOrientationMaskLandscape supposedNewInterfaceOrientation:UIInterfaceOrientationUnknown];
                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

RCT_EXPORT_METHOD(lockToLandscapeLeft:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [
                        self
                        setSupportedInterfaceOrientations:UIInterfaceOrientationMaskLandscapeRight
                        supposedNewInterfaceOrientation:UIInterfaceOrientationLandscapeRight
                    ];

                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

RCT_EXPORT_METHOD(lockToLandscapeRight:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [
                        self
                        setSupportedInterfaceOrientations:UIInterfaceOrientationMaskLandscapeLeft
                        supposedNewInterfaceOrientation:UIInterfaceOrientationLandscapeLeft
                    ];

                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

RCT_EXPORT_METHOD(lockToAllOrientationsButUpsideDown:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [
                        self
                        setSupportedInterfaceOrientations:UIInterfaceOrientationMaskAllButUpsideDown
                        supposedNewInterfaceOrientation:UIInterfaceOrientationUnknown
                    ];

                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

RCT_EXPORT_METHOD(unlockAllOrientations:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [self setSupportedInterfaceOrientations:UIInterfaceOrientationMaskAll supposedNewInterfaceOrientation:UIInterfaceOrientationUnknown];
                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

RCT_EXPORT_METHOD(resetInterfaceOrientationSetting:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [
        [NSOperationQueue mainQueue]
        addOperationWithBlock:^{
            [
                RNOrientationManager
                fulfillPromise:^id {
                    [self setSupportedInterfaceOrientations:defaultSupportedInterfaceOrientations supposedNewInterfaceOrientation:UIInterfaceOrientationUnknown];
                    return nil;
                }
                resolver:resolve
                rejecter:reject
            ];
        }
    ];
}

- (void)setSupportedInterfaceOrientations:(UIInterfaceOrientationMask)supportedInterfaceOrientations
        supposedNewInterfaceOrientation:(UIInterfaceOrientation) supposedNewInterfaceOrientation
{
    currentSupportedInterfaceOrientations = supportedInterfaceOrientations;
    
    if (@available(iOS 16, tvOS 16, *))
    {
        [[UIApplication sharedApplication].delegate.window.rootViewController setNeedsUpdateOfSupportedInterfaceOrientations];
        [self sendInterfaceOrientationChangedIfOccurredWithShortPeriodicCheck:false];
    }
    else
    {
        if (supposedNewInterfaceOrientation == UIInterfaceOrientationUnknown)
        {
            UIInterfaceOrientationMask currentInterfaceOrientationAsMask;
        
            switch ([self getInterfaceOrientation])
            {
                case UIInterfaceOrientationPortrait:
                    
                    currentInterfaceOrientationAsMask = UIInterfaceOrientationMaskPortrait;
                    break;
                    
                case UIInterfaceOrientationPortraitUpsideDown:
                    
                    currentInterfaceOrientationAsMask = UIInterfaceOrientationMaskPortraitUpsideDown;
                    break;
                    
                case UIInterfaceOrientationLandscapeLeft:
                    
                    currentInterfaceOrientationAsMask = UIInterfaceOrientationMaskLandscapeLeft;
                    break;
                    
                case UIInterfaceOrientationLandscapeRight:
                    
                    currentInterfaceOrientationAsMask = UIInterfaceOrientationMaskLandscapeRight;
                    break;
                    
                default:
                    currentInterfaceOrientationAsMask = UIInterfaceOrientationMaskAll;
            }

            UIInterfaceOrientationMask deviceOrientationAsInterfaceOrientationMask;
            UIInterfaceOrientation deviceOrientationAsInterfaceOrientation;
            
            switch ([self getDeviceOrientation])
            {
                case UIDeviceOrientationPortrait:
                    
                    deviceOrientationAsInterfaceOrientationMask = UIInterfaceOrientationMaskPortrait;
                    deviceOrientationAsInterfaceOrientation = UIInterfaceOrientationPortrait;
                    
                    break;

                case UIDeviceOrientationPortraitUpsideDown:
                    
                    deviceOrientationAsInterfaceOrientationMask = UIInterfaceOrientationMaskPortraitUpsideDown;
                    deviceOrientationAsInterfaceOrientation = UIInterfaceOrientationPortraitUpsideDown;
                    
                    break;

                case UIDeviceOrientationLandscapeLeft:
                    
                    deviceOrientationAsInterfaceOrientationMask = UIInterfaceOrientationMaskLandscapeRight;
                    deviceOrientationAsInterfaceOrientation = UIInterfaceOrientationLandscapeRight;
                    
                    break;

                case UIDeviceOrientationLandscapeRight:
                    
                    deviceOrientationAsInterfaceOrientationMask = UIInterfaceOrientationMaskLandscapeLeft;
                    deviceOrientationAsInterfaceOrientation = UIInterfaceOrientationLandscapeLeft;
                    
                    break;
                    
                default:
                    
                    deviceOrientationAsInterfaceOrientationMask = 0;
                    deviceOrientationAsInterfaceOrientation = UIInterfaceOrientationUnknown;
            }
            
            if (supportedInterfaceOrientations & deviceOrientationAsInterfaceOrientationMask)
            {
                if
                (
                    supportedInterfaceOrientations & currentInterfaceOrientationAsMask
                    && (
                        deviceOrientationAsInterfaceOrientationMask == currentInterfaceOrientationAsMask
                        ||
                        ![UIApplication sharedApplication].delegate.window.rootViewController.shouldAutorotate
                    )
                ) return;
                
                supposedNewInterfaceOrientation = deviceOrientationAsInterfaceOrientation;
            }
            else if (supportedInterfaceOrientations & currentInterfaceOrientationAsMask)
            {
                return;
            }
            else if (supportedInterfaceOrientations & UIInterfaceOrientationMaskPortrait)
            {
                supposedNewInterfaceOrientation = UIInterfaceOrientationPortrait;
            }
            else if (supportedInterfaceOrientations & UIInterfaceOrientationMaskPortraitUpsideDown)
            {
                supposedNewInterfaceOrientation = UIInterfaceOrientationPortraitUpsideDown;
            }
            else if (supportedInterfaceOrientations & UIInterfaceOrientationMaskLandscapeRight)
            {
                supposedNewInterfaceOrientation = UIInterfaceOrientationLandscapeRight;
            }
            else if (supportedInterfaceOrientations & UIInterfaceOrientationMaskLandscapeLeft)
            {
                supposedNewInterfaceOrientation = UIInterfaceOrientationLandscapeLeft;
            }
        }
        else if (supposedNewInterfaceOrientation == [self getInterfaceOrientation])
        {
            return;
        }
        
        [self setInterfaceOrientation:supposedNewInterfaceOrientation];
        
        if (supposedNewInterfaceOrientation == UIInterfaceOrientationPortraitUpsideDown) [self sendInterfaceOrientationChangedIfOccurredWithShortPeriodicCheck:true];
        else [self sendInterfaceOrientationChangedIfOccurred:supposedNewInterfaceOrientation];
    }
}

- (void)setInterfaceOrientation:(UIInterfaceOrientation)orientation
{
    UIDeviceOrientation deviceOrientation;
    
    switch (orientation)
    {
        case UIInterfaceOrientationPortrait:
            
            deviceOrientation = UIDeviceOrientationPortrait;
            break;
            
        case UIInterfaceOrientationPortraitUpsideDown:
            
            deviceOrientation = UIDeviceOrientationPortraitUpsideDown;
            break;
            
        case UIInterfaceOrientationLandscapeLeft:
            
            deviceOrientation = UIDeviceOrientationLandscapeRight;
            break;
            
        case UIInterfaceOrientationLandscapeRight:
            
            deviceOrientation = UIDeviceOrientationLandscapeLeft;
            break;
            
        default:
            deviceOrientation = UIDeviceOrientationUnknown;
    }
    
    settingInterfaceOrientation = true;
    
    @try
    {
        [[UIDevice currentDevice] setValue:@(deviceOrientation) forKey:@"orientation"];
        [UIViewController attemptRotationToDeviceOrientation];
        [[UIDevice currentDevice] setValue:@(lastDeviceOrientation) forKey:@"orientation"];
    }
    @finally
    {
        settingInterfaceOrientation = false;
    }
}

- (void)sendInterfaceOrientationChangedIfOccurredWithShortPeriodicCheck:(bool)doubleCheck
{
    typedef void (^SendInterfaceOrientationChanged)(id);
    __block NSInteger timesExecuted = 0;
    
    void (^sendInterfaceOrientationChanged)(SendInterfaceOrientationChanged sendInterfaceOrientationChanged) =
        ^void (SendInterfaceOrientationChanged sendInterfaceOrientationChanged) {
            if ([self sendInterfaceOrientationChangedIfOccurred])
            {
                if (doubleCheck) [self sendInterfaceOrientationChangedIfOccurredWithShortPeriodicCheck:false];
                return;
            }

            if (timesExecuted == 6) return;
            ++timesExecuted;
            
            dispatch_after(
                dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)),
                dispatch_get_main_queue(),
                ^{
                    sendInterfaceOrientationChanged(sendInterfaceOrientationChanged);
                }
            );
        }
    ;
    
    dispatch_after(
        dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)),
        dispatch_get_main_queue(),
       ^{
           sendInterfaceOrientationChanged(sendInterfaceOrientationChanged);
       }
    );
}

- (UIInterfaceOrientation)getInterfaceOrientation
{
    UIInterfaceOrientation orientation;

    if (@available(iOS 13, *)) orientation = [UIApplication sharedApplication].delegate.window.windowScene.interfaceOrientation;
    else orientation = [UIApplication sharedApplication].statusBarOrientation;

    switch (orientation)
    {
        case UIInterfaceOrientationPortrait:
        case UIInterfaceOrientationPortraitUpsideDown:
        case UIInterfaceOrientationLandscapeLeft:
        case UIInterfaceOrientationLandscapeRight:
            return orientation;

        default:
            return UIInterfaceOrientationUnknown;
    }
}

- (UIDeviceOrientation)getDeviceOrientation
{
    UIDeviceOrientation orientation = [UIDevice currentDevice].orientation;
  
    switch (orientation)
    {
        case UIDeviceOrientationPortrait:
        case UIDeviceOrientationPortraitUpsideDown:
        case UIDeviceOrientationLandscapeLeft:
        case UIDeviceOrientationLandscapeRight:
        case UIDeviceOrientationFaceUp:
        case UIDeviceOrientationFaceDown:
            return orientation;

        default:
            return UIDeviceOrientationUnknown;
    }
}

- (NSNumber *)interfaceOrientationToModuleValue:(UIInterfaceOrientation)orientation
{
    switch (orientation)
    {
        case UIInterfaceOrientationPortrait:
            return @(1);

        case UIInterfaceOrientationPortraitUpsideDown:
            return @(2);

        case UIInterfaceOrientationLandscapeLeft:
            return @(4);
        
        case UIInterfaceOrientationLandscapeRight:
            return @(3);

        default:
            return @(0);
    }
}

- (NSNumber *)deviceOrientationToModuleValue:(UIDeviceOrientation)orientation
{
    switch (orientation)
    {
        case UIDeviceOrientationPortrait:
            return @(1);

        case UIDeviceOrientationPortraitUpsideDown:
            return @(2);

        case UIDeviceOrientationLandscapeLeft:
            return @(3);
        
        case UIDeviceOrientationLandscapeRight:
            return @(4);

        case UIDeviceOrientationFaceUp:
            return @(5);
        
        case UIDeviceOrientationFaceDown:
            return @(6);

        default:
            return @(0);
    }
}

@end
