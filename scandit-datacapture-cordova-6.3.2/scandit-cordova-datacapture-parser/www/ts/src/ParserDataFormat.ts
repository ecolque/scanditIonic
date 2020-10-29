/// <amd-module name="scandit-cordova-datacapture-parser.ParserDataFormat"/>
// ^ needed because Cordova can't resolve "../xx" style dependencies

export enum ParserDataFormat {
    GS1AI = 'gs1ai',
    HIBC = 'hibc',
    DLID = 'dlid',
    MRTD = 'mrtd',
    SwissQR = 'swissQr',
    VIN = 'vin',
    UsUsid = 'usUsid',
}
