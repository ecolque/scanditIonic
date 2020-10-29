/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.cordova.parser.actions

import com.scandit.datacapture.cordova.core.actions.Action
import com.scandit.datacapture.cordova.core.actions.ActionJsonParseErrorResultListener
import com.scandit.datacapture.cordova.parser.data.SerializableParserInput
import com.scandit.datacapture.cordova.parser.handlers.ParsersHandler
import com.scandit.datacapture.parser.ParsedData
import org.apache.cordova.CallbackContext
import org.json.JSONArray
import org.json.JSONException

class ActionParseRawData(
    private val parsersHandler: ParsersHandler,
    private val listener: ResultListener,
    private val decoder: SerializableParserInput.Decoder = SerializableParserInput.Decoder()
) : Action {

    override fun run(args: JSONArray, callbackContext: CallbackContext) {
        try {
            val input = decoder.decode(args)
            val parser = parsersHandler.getParserForId(input.parserId)

            if (parser == null) {
                listener.onParseRawDataNoParserError(callbackContext)
            } else {
                val parsedData = parser.parseRawData(input.rawData)
                listener.onParseRawData(parsedData, callbackContext)
            }
        } catch (e: JSONException) {
            e.printStackTrace()
            listener.onJsonParseError(e, callbackContext)
        } catch (e: RuntimeException) {// TODO [SDC-1851] - fine-catch deserializer exceptions
            e.printStackTrace()
            listener.onParseRawDataNativeError(e, callbackContext)
        }
    }

    interface ResultListener : ActionJsonParseErrorResultListener {
        fun onParseRawData(
            parsedData: ParsedData,
            callbackContext: CallbackContext
        )

        fun onParseRawDataNativeError(error: Throwable, callbackContext: CallbackContext)
        fun onParseRawDataNoParserError(callbackContext: CallbackContext)
    }
}