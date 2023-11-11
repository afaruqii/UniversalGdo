import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { UniversalGarageDoorPlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class UniversalGarageDoorPlatformAccessory {
  private service: Service;
  private currentDoorState = this.platform.Characteristic.CurrentDoorState.CLOSED;
  private doorTargetState = this.getTargetFromCurrent(this.currentDoorState);

  /**
   * These are just used to create a working example
   * You should implement your own code to track the state of your accessory
   */


  constructor(
    private readonly platform: UniversalGarageDoorPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Chamberlain')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');

    // get the Garage Door service if it exists, otherwise create a new Garage Door service
    this.service = this.accessory.getService(this.platform.Service.GarageDoorOpener) ||
    this.accessory.addService(this.platform.Service.GarageDoorOpener);

    // set the service name, this is what is displayed as the default name on the Home app
    // in this example we are using the name we stored in the `accessory.context` in the `discoverDevices` method.
    this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName); //update this...

    // each service must implement at-minimum the "required characteristics" for the given service type
    // see https://developers.homebridge.io/#/service/Lightbulb
    //*******************************************************************************//
    //****************************REGISTER HANDLERS**********************************//
    //*******************************************************************************//

    // register handlers for the CurrentDoorState Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.CurrentDoorState)
      .onGet(this.getCurrentDoorState.bind(this));

    // register handlers for the TargetDoorState Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.TargetDoorState)
      .onGet(this.getTargetDoorState.bind(this))
      .onSet(this.setTargetDoorState.bind(this));

    // register handlers for the ObstructionDetected Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.ObstructionDetected)
      .onGet(this.getObstructionDetected.bind(this));


    /**
     * Creating multiple services of the same type.
     *
     * To avoid "Cannot add a Service with the same UUID another Service without also defining a unique 'subtype' property." error,
     * when creating multiple services of the same type, you need to use the following syntax to specify a name and subtype id:
     * this.accessory.getService('NAME') || this.accessory.addService(this.platform.Service.Lightbulb, 'NAME', 'USER_DEFINED_SUBTYPE_ID');
     *
     * The USER_DEFINED_SUBTYPE must be unique to the platform accessory (if you platform exposes multiple accessories, each accessory
     * can use the same sub type id.)
     */

  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  // async setOn(value: CharacteristicValue) {
  //   // implement your own code to turn your device on/off
  //   this.exampleStates.On = value as boolean;

  //   this.platform.log.debug('Set Characteristic On ->', value);
  // }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getCurrentDoorState(): Promise<CharacteristicValue> {
    const currentState = this.currentDoorState;

    this.platform.log.debug('Get Characteristic On ->', currentState);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return currentState;
  }

  async getTargetDoorState(): Promise<CharacteristicValue> {
    const targetState = this.doorTargetState;

    this.platform.log.debug('Get Characteristic On ->', targetState);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return targetState;
  }

  async setTargetDoorState(): Promise<CharacteristicValue> {
    const targetState = this.doorTargetState;

    this.platform.log.debug('Get Characteristic On ->', targetState);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return targetState;
  }

  async getObstructionDetected(): Promise<CharacteristicValue> {
    const targetState = this.doorTargetState;

    this.platform.log.debug('Get Characteristic On ->', targetState);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return targetState;
  }



  // async getCurrentDoorState(): Promise<CharacteristicValue> {

  // }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, changing the Brightness
   */
  // async setBrightness(value: CharacteristicValue) {
  //   // implement your own code to set the brightness
  //   this.exampleStates.Brightness = value as number;

  //   this.platform.log.debug('Set Characteristic Brightness -> ', value);
  // }
  //*******************************************************************************//
  //*******************************UTIL FUNCTIONS**********************************//
  //*******************************************************************************//

  private getTargetFromCurrent(doorState: CharacteristicValue): CharacteristicValue {
    switch(doorState) {

      case this.platform.Characteristic.CurrentDoorState.OPEN:
      case this.platform.Characteristic.CurrentDoorState.OPENING:
      case this.platform.Characteristic.CurrentDoorState.STOPPED:
        return this.platform.Characteristic.TargetDoorState.OPEN;
        break;

      case this.platform.Characteristic.CurrentDoorState.CLOSED:
      case this.platform.Characteristic.CurrentDoorState.CLOSING:
      default:
        return this.platform.Characteristic.TargetDoorState.CLOSED;
        break;
    }
  }

}
