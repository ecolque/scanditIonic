/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.cordova.parser.factories

import com.scandit.datacapture.cordova.core.actions.Action
import com.scandit.datacapture.cordova.core.errors.InvalidActionNameError
import com.scandit.datacapture.cordova.core.factories.ActionFactory
import com.scandit.datacapture.cordova.parser.ParserActionsListeners
import com.scandit.datacapture.cordova.parser.actions.ActionInjectDefaults
import com.scandit.datacapture.cordova.parser.actions.ActionParseRawData
import com.scandit.datacapture.cordova.parser.actions.ActionParseString
import com.scandit.datacapture.cordova.parser.handlers.ParsersHandler

class ParserActionFactory(
    private val parsersHandler: ParsersHandler,
    private val listener: ParserActionsListeners
) : ActionFactory {

    @Throws(InvalidActionNameError::class)
    override fun provideAction(actionName: String): Action {
        return when (actionName) {
            INJECT_DEFAULTS -> createActionInjectDefaults()
            PARSE_STRING -> createActionParseString()
            PARSE_RAW_DATA -> createActionParseRawData()
            else -> throw InvalidActionNameError(actionName)
        }
    }

    private fun createActionInjectDefaults(): Action = ActionInjectDefaults(listener)

    private fun createActionParseString(): Action = ActionParseString(parsersHandler, listener)

    private fun createActionParseRawData(): Action = ActionParseRawData(parsersHandler, listener)

    override val actionsNotDependentOnCameraPermission = ACTIONS_NOT_DEPENDING_ON_CAMERA

    companion object {
        private const val INJECT_DEFAULTS = "getDefaults"
        private const val PARSE_STRING = "parseString"
        private const val PARSE_RAW_DATA = "parseRawData"

        private val ACTIONS_NOT_DEPENDING_ON_CAMERA = setOf(
            INJECT_DEFAULTS, PARSE_STRING, PARSE_RAW_DATA
        )
    }
}

