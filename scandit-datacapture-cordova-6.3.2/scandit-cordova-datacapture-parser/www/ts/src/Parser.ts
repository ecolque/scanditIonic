/// <amd-module name="scandit-cordova-datacapture-parser.Parser"/>
// ^ needed because Cordova can't resolve "../xx" style dependencies
import {
    DataCaptureComponent,
    DataCaptureContext,
    PrivateDataCaptureComponent,
    PrivateDataCaptureContext,
} from 'DataCaptureContext';
import { ParsedData } from 'ParsedData';
import { ParserDataFormat } from 'ParserDataFormat';
import { DefaultSerializeable, ignoreFromSerialization, nameForSerialization } from 'Serializeable';
import { ParserProxy } from './Cordova/ParserProxy';

export interface PrivateParser extends PrivateDataCaptureComponent {
    dataFormat: ParserDataFormat;
    options: { [key: string]: any };
    proxy: ParserProxy;
}

export class Parser extends DefaultSerializeable implements DataCaptureComponent {

    private type = 'parser';
    private dataFormat: ParserDataFormat;
    private options = {} as { [key: string]: any };

    @nameForSerialization('id')
    private _id: string = `${Date.now()}`;
    public get id(): string {
        return this._id;
    }

    @ignoreFromSerialization
    private _context: DataCaptureContext;

    @ignoreFromSerialization
    private _proxy: ParserProxy;
    private get proxy(): ParserProxy {
        if (!this._proxy) {
            this._proxy = ParserProxy.forParser(this);
        }
        return this._proxy;
    }

    public static forContextAndFormat(context: DataCaptureContext, dataFormat: ParserDataFormat): Parser {
        const parser = new Parser();
        parser.dataFormat = dataFormat;
        (context as any as PrivateDataCaptureContext).addComponent(parser);
        return parser;
    }

    private constructor() {
        super();
    }

    public setOptions(options: { [key: string]: any }): Promise<void> {
        this.options = options;
        return (this._context as any as PrivateDataCaptureContext).update();
    }

    public parseString(data: string): Promise<ParsedData> {
        return this.proxy.parseString(data);
    }

    public parseRawData(data: string): Promise<ParsedData> {
        return this.proxy.parseRawData(data);
    }
}
