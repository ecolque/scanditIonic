/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.cordova.parser

import com.scandit.datacapture.cordova.core.ScanditCaptureCore
import com.scandit.datacapture.cordova.core.communication.ComponentDeserializersProvider
import com.scandit.datacapture.cordova.core.errors.InvalidActionNameError
import com.scandit.datacapture.cordova.core.errors.JsonParseError
import com.scandit.datacapture.cordova.core.factories.ActionFactory
import com.scandit.datacapture.cordova.core.handlers.ActionsHandler
import com.scandit.datacapture.cordova.core.handlers.CameraPermissionsActionsHandlerHelper
import com.scandit.datacapture.cordova.parser.actions.ActionInjectDefaults
import com.scandit.datacapture.cordova.parser.actions.ActionParseRawData
import com.scandit.datacapture.cordova.parser.actions.ActionParseString
import com.scandit.datacapture.cordova.parser.errors.CannotParseRawDataError
import com.scandit.datacapture.cordova.parser.errors.CannotParseStringError
import com.scandit.datacapture.cordova.parser.errors.ParserInstanceNotFoundError
import com.scandit.datacapture.cordova.parser.factories.ParserActionFactory
import com.scandit.datacapture.cordova.parser.handlers.ParsersHandler
import com.scandit.datacapture.core.component.serialization.DataCaptureComponentDeserializer
import com.scandit.datacapture.core.json.JsonValue
import com.scandit.datacapture.parser.ParsedData
import com.scandit.datacapture.parser.Parser
import com.scandit.datacapture.parser.serialization.ParserDeserializer
import com.scandit.datacapture.parser.serialization.ParserDeserializerListener
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaPlugin
import org.json.JSONArray

class ScanditParser : CordovaPlugin(),
    ParserActionsListeners,
    ParserDeserializerListener,
    ComponentDeserializersProvider {

    private val parsersHandler: ParsersHandler = ParsersHandler()
    private val actionFactory: ActionFactory = ParserActionFactory(parsersHandler, this)
    private val actionsHandler: ActionsHandler = ActionsHandler(
        actionFactory, CameraPermissionsActionsHandlerHelper(actionFactory)
    )

    override fun pluginInitialize() {
        super.pluginInitialize()
        ScanditCaptureCore.addPlugin(serviceName)
    }

    override fun execute(
        action: String, args: JSONArray, callbackContext: CallbackContext
    ): Boolean {
        return try {
            actionsHandler.addAction(action, args, callbackContext)
        } catch (e: InvalidActionNameError) {
            false
        } catch (e: Exception) {
            e.printStackTrace()
            true
        }
    }

    override fun onParserDefaults(callbackContext: CallbackContext) {
        callbackContext.success()
    }

    //region Action callbacks
    override fun onJsonParseError(error: Throwable, callbackContext: CallbackContext) {
        JsonParseError(error.message).sendResult(callbackContext)
    }

    //region ActionParseRawData.ResultListener
    override fun onParseRawData(
        parsedData: ParsedData, callbackContext: CallbackContext
    ) {
        callbackContext.success(parsedData.jsonString)
    }

    override fun onParseRawDataNativeError(error: Throwable, callbackContext: CallbackContext) {
        CannotParseStringError(error.localizedMessage).sendResult(callbackContext)
    }

    override fun onParseRawDataNoParserError(callbackContext: CallbackContext) {
        ParserInstanceNotFoundError().sendResult(callbackContext)
    }
    //endregion

    //region ActionParseString.ResultListener
    override fun onParseString(
        parsedData: ParsedData, callbackContext: CallbackContext
    ) {
        callbackContext.success(parsedData.jsonString)
    }

    override fun onParseStringNativeError(error: Throwable, callbackContext: CallbackContext) {
        CannotParseRawDataError(error.localizedMessage).sendResult(callbackContext)
    }

    override fun onParseStringNoParserError(callbackContext: CallbackContext) {
        ParserInstanceNotFoundError().sendResult(callbackContext)
    }
    //endregion
    //endregion

    //region ParserDeserializerListener
    override fun onParserDeserializationFinished(
        deserializer: ParserDeserializer,
        parser: Parser,
        json: JsonValue
    ) {
        parser.updateFromJson(json.jsonString())
        parsersHandler.registerParser(json.requireByKeyAsString("id"), parser)
    }
    //endregion

    //region ComponentDeserializersProvider
    override fun provideComponentDeserializers(): List<DataCaptureComponentDeserializer> = listOf(
        ParserDeserializer().also { it.listener = this }
    )
    //endregion
}

interface ParserActionsListeners :
    ActionInjectDefaults.ResultListener,
    ActionParseRawData.ResultListener,
    ActionParseString.ResultListener
