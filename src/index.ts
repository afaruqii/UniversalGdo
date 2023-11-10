import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import { UniversalGarageDoorPlatform } from './platform';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, UniversalGarageDoorPlatform);
};
