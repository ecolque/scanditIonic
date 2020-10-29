const copyRecursive = require('../../scandit-cordova-datacapture-core/scripts/copy-recursive')
const removeRecursive = require('../../scandit-cordova-datacapture-core/scripts/remove-recursive')

const postBuild = () => {
   copyRecursive('./www/js/scandit-cordova-datacapture-parser/www/ts/src', './www/js')
   removeRecursive('www/js/scandit-cordova-datacapture-parser')
   removeRecursive('www/js/scandit-cordova-datacapture-core')
}

postBuild()
