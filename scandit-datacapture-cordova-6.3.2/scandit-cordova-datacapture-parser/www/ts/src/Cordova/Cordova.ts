/// <amd-module name="scandit-cordova-datacapture-parser.Cordova"/>
// ^ needed because Cordova can't resolve "../xx" style dependencies
import { cordovaExec, initializePlugin } from 'Cordova/CommonCordova';

// tslint:disable-next-line:variable-name
export const Cordova = {
  pluginName: 'ScanditParser',
  exec: (
    success: Optional<Function>,
    error: Optional<Function>,
    functionName: string,
    args: Optional<[any]>,
  ) => cordovaExec(success, error, Cordova.pluginName, functionName, args),
};

const getDefaults: Promise<void> = new Promise((resolve, reject) => {
  Cordova.exec(
    resolve,
    reject,
    'getDefaults',
    null);
});

initializePlugin(Cordova.pluginName, getDefaults);

export enum CordovaFunction {
  ParseString = 'parseString',
  ParseRawData = 'parseRawData',
}
