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
  private obstructionDetected = false;

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


  }


  //
  //If your device takes time to respond you should update the status of your device
  //asynchronously instead using the `updateCharacteristic` method instead.

  async getCurrentDoorState(): Promise<CharacteristicValue> {
    const currentState = this.currentDoorState;

    this.platform.log.info(`${this.accessory.displayName} is currently: ${this.mappedCurrentStatesToEnglish(currentState)} `);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return currentState;
  }

  async getTargetDoorState(): Promise<CharacteristicValue> {
    const targetState = this.doorTargetState;
    this.platform.log.info(`${this.accessory.displayName} will be: ${this.mappedTargetStatesToEnglish(targetState)} ` );

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return targetState;
  }

  async setTargetDoorState(): Promise<CharacteristicValue> {
    const targetState = this.doorTargetState;
    if(targetState === this.platform.Characteristic.TargetDoorState.CLOSED){
      this.doorTargetState = this.platform.Characteristic.TargetDoorState.OPEN;
      this.currentDoorState = 2;
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.currentDoorState = 0;
      return this.doorTargetState;
    }
    this.doorTargetState = this.platform.Characteristic.TargetDoorState.CLOSED;
    this.currentDoorState = 3;
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.currentDoorState = 1;
    return this.doorTargetState;

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

  }

  async getObstructionDetected(): Promise<CharacteristicValue> {
    const targetState = this.doorTargetState;

    this.platform.log.debug('Get Characteristic On ->', targetState);

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);

    return this.obstructionDetected;
  }

  //*******************************************************************************//
  //*******************************UTIL FUNCTIONS**********************************//
  //*******************************************************************************//

  private getTargetFromCurrent(doorState: CharacteristicValue): CharacteristicValue {
    switch(doorState) {

      case this.platform.Characteristic.CurrentDoorState.OPEN:
      case this.platform.Characteristic.CurrentDoorState.OPENING:
      case this.platform.Characteristic.CurrentDoorState.STOPPED:
        return this.platform.Characteristic.TargetDoorState.OPEN;

      case this.platform.Characteristic.CurrentDoorState.CLOSED:
      case this.platform.Characteristic.CurrentDoorState.CLOSING:
      default:
        return this.platform.Characteristic.TargetDoorState.CLOSED;
    }
  }

  private mappedCurrentStatesToEnglish(doorState: CharacteristicValue): string {
    switch(doorState){
      case this.platform.Characteristic.CurrentDoorState.OPEN:
        return 'OPEN';
        break;
      case this.platform.Characteristic.CurrentDoorState.OPENING:
        return 'OPENING';
      case this.platform.Characteristic.CurrentDoorState.STOPPED:
        return 'STOPPED';
      case this.platform.Characteristic.CurrentDoorState.CLOSED:
        return 'CLOSED';
      case this.platform.Characteristic.CurrentDoorState.CLOSING:
        return 'CLOSING';
    }
    return '';
  }

  private mappedTargetStatesToEnglish(doorState: CharacteristicValue): string {
    switch(doorState){
      case this.platform.Characteristic.TargetDoorState.OPEN:
        return 'OPEN';
      case this.platform.Characteristic.TargetDoorState.CLOSED:
        return 'CLOSED';
    }
    return '';
  }
}
