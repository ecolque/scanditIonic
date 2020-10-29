import ScanditParser

extension CDVPluginResult {
    static func success(withParsedData parsedData: ParsedData) -> CDVPluginResult {
        return .success(message: parsedData.jsonString)
    }
}

struct ParserCommandArgument: CommandJSONArgument {
    let id: String
    let data: String
}

extension Array where Element == Parser {
    func parser(withID parserID: String) -> Parser? {
        return self.first(where: { $0.componentId == parserID })
    }
}

@objc(ScanditParser)
public class ScanditParser: CDVPlugin, DataCapturePlugin {
    lazy var modeDeserializers: [DataCaptureModeDeserializer] = []

    lazy var componentDeserializers: [DataCaptureComponentDeserializer] = {
        let parserDeserializer = ParserDeserializer()
        parserDeserializer.delegate = self
        return [parserDeserializer]
    }()

    var components: [DataCaptureComponent] {
        return parsers
    }

    lazy var parsers = [Parser]()

    override public func pluginInitialize() {
        super.pluginInitialize()
        ScanditCaptureCore.dataCapturePlugins.append(self)
    }

    @objc(getDefaults:)
    func getDefaults(command: CDVInvokedUrlCommand) {
        commandDelegate.send(.success(message: [:]), callbackId: command.callbackId)
    }


    @objc(parseString:)
    func parseString(command: CDVInvokedUrlCommand) {
        guard let commandArgument = try? ParserCommandArgument.fromCommand(command) else {
            commandDelegate.send(.failure(with: .invalidJSON), callbackId: command.callbackId)
            return
        }

        guard let parser = parsers.parser(withID: commandArgument.id) else {
            commandDelegate.send(.failure(with: .parserNotFound), callbackId: command.callbackId)
            return
        }

        do {
            let parsedData = try parser.parseString(commandArgument.data)
            commandDelegate.send(.success(withParsedData: parsedData), callbackId: command.callbackId)
        } catch let error {
            commandDelegate.send(.failure(with: .couldNotParseString(reason: error.localizedDescription)),
                                 callbackId: command.callbackId)
        }
    }

    @objc(parseRawData:)
    func parseRawData(command: CDVInvokedUrlCommand) {
        guard let commandArgument = try? ParserCommandArgument.fromCommand(command) else {
            commandDelegate.send(.failure(with: .invalidJSON), callbackId: command.callbackId)
            return
        }

        guard let parser = parsers.parser(withID: commandArgument.id) else {
            commandDelegate.send(.failure(with: .parserNotFound), callbackId: command.callbackId)
            return
        }

        guard let data = Data(base64Encoded: commandArgument.data) else {
            commandDelegate.send(.failure(with: .couldNotParseRawData(reason: "Could not decode base64 data")),
                                 callbackId: command.callbackId)
            return
        }

        do {
            let parsedData = try parser.parseRawData(data)
            commandDelegate.send(.success(withParsedData: parsedData), callbackId: command.callbackId)
        } catch let error {
            commandDelegate.send(.failure(with: .couldNotParseRawData(reason: error.localizedDescription)),
                                 callbackId: command.callbackId)
        }
    }
}
