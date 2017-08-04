/**
 * Validates ccss against custom defined rules.
 */
function validateCSS(ccss) {
  _validateNotFillFile(ccss);
}

/**
 * Throw an exception if the ccss has colored file makers.
 * Tangram cannot handle painting a image causing a bad result.
 */
function _validateNotFillFile(ccss) {
  if (ccss.includes('marker-fill') && ccss.includes('marker-file')) {
    throw new Error('tangram don\'t support colored markers: marker-file and marker-fill properties are not compatible');
  }
}


module.exports = { validateCSS };
