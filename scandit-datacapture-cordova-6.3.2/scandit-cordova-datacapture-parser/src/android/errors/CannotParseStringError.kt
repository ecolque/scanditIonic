/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.cordova.parser.errors

import com.scandit.datacapture.cordova.core.errors.ActionError

class CannotParseStringError(errorMessage: String) : ActionError(
    ERROR_CODE,
    errorMessage
) {

    companion object {
        private const val ERROR_CODE = 10062
    }
}