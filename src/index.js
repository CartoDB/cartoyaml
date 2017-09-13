const carto = require('carto');
const tangramReference = require('tangram-reference').load();
const translate = require('./translate.js');

const cartoRenderer = new carto.RendererJS({
    reference: tangramReference,
    strict: true
});

function processPoints(scene, layer, drawGroupName) {
    if (layer.shader.symbolizers.indexOf('markers') >= 0) {
        scene.filter = translate.getFilterFn(layer, 'markers');

        scene.draw[drawGroupName] = { _hidden: {} };
        scene.styles[drawGroupName] = { base: 'points' };
        const drawGroup = scene.draw[drawGroupName];
        //for each scene property
        //opacity *must* be processed first
        translate.defProperty(drawGroup, layer, 'marker-opacity', 'opacity:general');
        translate.defProperty(drawGroup, layer, 'marker-line-opacity', 'opacity:outline');
        translate.defProperty(drawGroup, layer, 'marker-fill-opacity', 'opacity:fill');

        translate.defProperty(drawGroup, layer, 'marker-fill', 'color');
        translate.defProperty(drawGroup, layer, 'marker-allow-overlap', 'collide');
        translate.defProperty(drawGroup, layer, 'marker-width', 'size');
        translate.defProperty(drawGroup, layer, 'marker-comp-op', 'blend');
        translate.defProperty(drawGroup, layer, 'marker-line-color', 'outline:color');
        translate.defProperty(drawGroup, layer, 'marker-line-width', 'outline:width');

        delete drawGroup._hidden;
    }
}

function processDots(scene, layer, drawGroupName) {
    if (layer.shader.symbolizers.indexOf('dot') >= 0) {
        scene.filter = translate.getFilterFn(layer, 'dot');

        scene.draw[drawGroupName] = { _hidden: {} };
        scene.styles[drawGroupName] = { base: 'points' };
        const drawGroup = scene.draw[drawGroupName];
        //for each scene property
        //opacity *must* be processed first
        translate.defProperty(drawGroup, layer, 'dot-opacity', 'opacity:general');

        translate.defProperty(drawGroup, layer, 'dot-fill', 'color');
        translate.defProperty(drawGroup, layer, 'dot-width', 'size');
        translate.defProperty(drawGroup, layer, 'dot-comp-op', 'blend');

        delete drawGroup._hidden;
    }
}

function processLines(scene, layer, drawGroupName) {
    if (layer.shader.symbolizers.indexOf('line') >= 0) {
        scene.filter = translate.getFilterFn(layer, 'line');

        scene.draw[drawGroupName] = { _hidden: {} };
        scene.styles[drawGroupName] = { base: 'lines' };
        const drawGroup = scene.draw[drawGroupName];
        //for each scene property
        //opacity *must* be processed first
        translate.defProperty(drawGroup, layer, 'line-opacity', 'opacity:general');

        translate.defProperty(drawGroup, layer, 'line-color', 'color');
        translate.defProperty(drawGroup, layer, 'line-width', 'width');
        translate.defProperty(drawGroup, layer, 'line-join', 'join');
        translate.defProperty(drawGroup, layer, 'line-cap', 'cap');
        translate.defProperty(drawGroup, layer, 'line-comp-op', 'blend');
        translate.defProperty(drawGroup, layer, 'line-dasharray', 'dash');
        delete drawGroup._hidden;
    }
}

function processPolys(scene, layer, drawGroupName) {
    if (layer.shader.symbolizers.indexOf('polygon') >= 0) {
        scene.filter = translate.getFilterFn(layer, 'polygon');

        scene.draw[drawGroupName] = { _hidden: {} };
        scene.styles[drawGroupName] = { base: 'polygons' };
        const drawGroup = scene.draw[drawGroupName];
        //for each scene property
        //opacity *must* be processed first
        translate.defProperty(drawGroup, layer, 'polygon-opacity', 'opacity:general');

        translate.defProperty(drawGroup, layer, 'polygon-fill', 'color');
        translate.defProperty(drawGroup, layer, 'polygon-comp-op', 'blend');

        delete drawGroup._hidden;
    }
}

function processStyle(scene, drawGroupName, layerID) {
    scene.styles[drawGroupName].blend = scene.draw[drawGroupName].blend;
    scene.styles[drawGroupName].blend_order = layerID;
    delete scene.draw[drawGroupName].blend;
}

function layerToScene(layer, layerID) {
    var scene = {
        draw: {},
        styles: {},
        textures: {}
    };
    if (layer.shader.symbolizers.length > 1) {
        throw new Error('Multiple symbolizer on one layer is not supported');
    } else if (layer.shader.symbolizers.length === 1) {
        const drawGroupName = `drawGroup${layerID}`;
        processPoints(scene, layer, drawGroupName);
        processDots(scene, layer, drawGroupName);
        processLines(scene, layer, drawGroupName);
        processPolys(scene, layer, drawGroupName);
        scene.draw[drawGroupName].order = layerID;
        processStyle(scene, drawGroupName, layerID);
    }
    return scene;
}
module.exports.layerToScene = layerToScene;

function cartoCssToDrawGroups(cartoCss, superLayerID = '') {
    const drawLayers = cartoRenderer.render(cartoCss).getLayers();

    return drawLayers.map((l, i) => {
        return layerToScene(l, superLayerID + '_' + i);
    });
}
module.exports.cartoCssToDrawGroups = cartoCssToDrawGroups;

/**
 * Returns an object representing whether the CartoCSS is supported or not. If it's not supported
 * it will have a reason property reflecting the cause.
 *
 * @returns {Object} {supported: {Boolean}[, reason: {String}]}
 */
module.exports.getSupportResult = function getSupportResult(cartoCss) {
    var result = { supported: true };
    try {
        cartoCssToDrawGroups(cartoCss);
    } catch (e) {
        result.supported = false;
        result.reason = e.message || 'unknown';
    }
    return result;
};
