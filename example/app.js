var lore = Lore.init('loreCanvas');

var csvReader = new Lore.CsvFileReader('csv', {
    header: false,
    //cols: [0, 1, 2, 3, 4, 5],
    cols: [0, 1, 2],
    //types: ['Uint16Array', 'Uint16Array', 'Uint16Array', 'Uint16Array', 'Uint16Array', 'Uint16Array'],
    types: ['Float32Array', 'Float32Array', 'Float32Array'],
    separator: ','
});

var first = true;
var pointHelper = null;
csvReader.addEventListener('loaded', function(e) {
    if(first) {
        pointHelper = new Lore.PointHelper(lore, 'TestGeometry', 'default');
        pointHelper.geometry.isVisible = true;
        pointHelper.setPositionsXYZHSS(e[0], e[1], e[2], 0.25, 1, 1);
        
        var octreeHelper = new Lore.OctreeHelper(lore, 'OctreeGeometry', 'default', pointHelper);
        octreeHelper.addEventListener('selectedchanged', function(e) {
            console.log(e);
        });
        octreeHelper.addEventListener('hoveredchanged', function(e) {
            console.log(e);
        });

        pointHelper.addFilter('hueRange', new Lore.InRangeFilter('color', 0, 0.22, 0.25));

        first = false;
    } else {
        pointHelper.updateRGB(e[0], e[1], e[2]);
        pointHelper.getFilter('hueRange').filter();
    }
});

document.getElementById('radius-button').addEventListener('click', function() {
    var val = document.getElementById('radius').value;
    lore.controls.setRadius(val);
});
document.getElementById('fog-button').addEventListener('click', function() {
    var val = document.getElementById('fog').value;
    pointHelper.setFogDistance(val);
});
document.getElementById('cutoff-button').addEventListener('click', function() {
    var val = document.getElementById('cutoff').value;
    pointHelper.setCutoff(val);
});
document.getElementById('filter').addEventListener('input', function() {
    var val = parseFloat(document.getElementById('filter').value);
    var filter = pointHelper.getFilter('hueRange');

    val = Lore.Color.gdbHueShift(val);
    filter.setMin(val - 0.002);
    filter.setMax(val + 0.002);
    filter.filter();
});
document.getElementById('topview-button').addEventListener('click', function() {
    lore.controls.setTopView();
});
document.getElementById('frontview-button').addEventListener('click', function() {
    lore.controls.setFrontView();
});
document.getElementById('leftview-button').addEventListener('click', function() {
    lore.controls.setLeftView();
});
document.getElementById('rightview-button').addEventListener('click', function() {
    lore.controls.setRightView();
});
document.getElementById('freeview-button').addEventListener('click', function() {
    lore.controls.setFreeView();
});
document.getElementById('zoomin-button').addEventListener('click', function() {
    lore.controls.zoomIn();
});
document.getElementById('zoomout-button').addEventListener('click', function() {
    lore.controls.zoomOut();
});
document.getElementById('setLookAt-button').addEventListener('click', function() {
    var val = parseFloat(document.getElementById('setLookAt').value);
    
    lore.controls.setLookAt(pointHelper.getPosition(val));
});

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    },
    methods: {
        setBackView: function() {
            lore.controls.setBackView();
        }
    }
});