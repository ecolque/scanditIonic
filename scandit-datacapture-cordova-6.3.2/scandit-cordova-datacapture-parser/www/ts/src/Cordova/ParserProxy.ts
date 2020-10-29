/// <amd-module name="scandit-cordova-datacapture-parser.ParserProxy"/>
// ^ needed because Cordova can't resolve "../xx" style dependencies
import { ParsedData, PrivateParsedData } from '../ParsedData';
import { Cordova, CordovaFunction } from './Cordova';

declare type Parser = any; // To avoid a circular dependency. Parser is only used here as a type

export class ParserProxy {
    private static cordovaExec = Cordova.exec;
    private parser: Parser;

    public static forParser(parser: Parser): ParserProxy {
        const proxy = new ParserProxy();
        proxy.parser = parser;
        return proxy;
    }

    public parseString(data: string): Promise<ParsedData> {
        return new Promise((resolve, reject) =>
            ParserProxy.cordovaExec(
                (parsedData: string) =>
                    resolve((ParsedData as any as PrivateParsedData).fromJSON(JSON.parse(parsedData))),
                reject,
                CordovaFunction.ParseString,
                [{
                    id: this.parser.id,
                    data,
                }],
            ),
        );
    }

    public parseRawData(data: string): Promise<ParsedData> {
        return new Promise((resolve, reject) =>
            ParserProxy.cordovaExec(
                (parsedData: string) =>
                    resolve((ParsedData as any as PrivateParsedData).fromJSON(JSON.parse(parsedData))),
                reject,
                CordovaFunction.ParseRawData,
                [{
                    id: this.parser.id,
                    data,
                }],
            ),
        );
    }
}
