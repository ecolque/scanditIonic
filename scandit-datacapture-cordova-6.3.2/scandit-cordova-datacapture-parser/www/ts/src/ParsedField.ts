/// <amd-module name="scandit-cordova-datacapture-parser.ParsedField"/>
// ^ needed because Cordova can't resolve "../xx" style dependencies
export interface ParsedFieldJSON {
    name: string;
    parsed: any;
    rawString: string;
    issues?: string[];
}

export interface PrivateParsedField {
    fromJSON(json: ParsedFieldJSON): ParsedField;
}

export class ParsedField {
    private _name: string;
    public get name(): string {
        return this._name;
    }

    private _parsed: any;
    public get parsed(): any {
        return this._parsed;
    }

    private _rawString: string;
    public get rawString(): string {
        return this._rawString;
    }

    private _issues: string[];
    public get issues(): string[] {
        return this._issues;
    }

    private static fromJSON(json: ParsedFieldJSON): ParsedField {
        const field = new ParsedField();

        field._name = json.name;
        field._parsed = json.parsed;
        field._rawString = json.rawString;
        field._issues = json.issues || [];

        return field;
    }
}
