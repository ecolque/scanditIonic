/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.cordova.parser.actions

import com.scandit.datacapture.cordova.core.actions.Action
import com.scandit.datacapture.cordova.core.actions.ActionJsonParseErrorResultListener
import org.apache.cordova.CallbackContext
import org.json.JSONArray

class ActionInjectDefaults(
    private val listener: ResultListener
) : Action {

    override fun run(args: JSONArray, callbackContext: CallbackContext) {
        listener.onParserDefaults(callbackContext)
    }

    interface ResultListener : ActionJsonParseErrorResultListener {
        fun onParserDefaults(callbackContext: CallbackContext)
    }
}