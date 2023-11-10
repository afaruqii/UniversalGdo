
//**********************************************************************//
//---------------------------Time Intervals(s)--------------------------//
//**********************************************************************//

export const DEVICE_REFRESH_INTERVAL = 5; // for polling the Garage Door controller API for updates about device states.


export const ACTIVE_DEVICE_REFRESH_INTERVAL = 1; // for polling the controller controller API during active state change.


export const ACTIVE_DEVICE_REFRESH_DURATION = 60 * 5; //for how long we should continue to actively poll device state changes.

//**********************************************************************//
//--------------------------Plugin Configuration------------------------//
//**********************************************************************//

export const PLATFORM_NAME = 'UniversalGdo'; // the name of the platform created by the plugin.


export const PLUGIN_NAME = 'homebridge-universal-gdo'; // The name of our plugin.