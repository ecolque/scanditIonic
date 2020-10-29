/*
 * This file is part of the Scandit Data Capture SDK
 *
 * Copyright (C) 2020- Scandit AG. All rights reserved.
 */

package com.scandit.datacapture.cordova.parser.errors

import com.scandit.datacapture.cordova.core.errors.ActionError

class ParserInstanceNotFoundError : ActionError(
    ERROR_CODE,
    "Parser instance not found"
) {

    companion object {
        private const val ERROR_CODE = 10061
    }
}