var lore = Lore.init('loreCanvas');

var csvReader = new Lore.CsvFileReader('csv', {
    header: true,
    //cols: [0, 1, 2, 3, 4, 5],
    //cols: ['reclat', 'mass', 'reclong'],
    //types: ['Uint16Array', 'Uint16Array', 'Uint16Array', 'Uint16Array', 'Uint16Array', 'Uint16Array'],
    types: ['Float32Array', 'Float32Array', 'Float32Array'],
    separator: ','
});

var first = true;
var pointHelper = null;

csvReader.addEventListener('loaded', function(data) {
    pointHelper = new Lore.PointHelper(lore, 'TestGeometry', 'sphere');
    pointHelper.geometry.isVisible = true;
    for (var i = 0; i < data['mass'].length; i++) {
        data['mass'][i] = Math.sqrt(data['mass'][i]);
    }
    pointHelper.setPositionsXYZHSS(data['reclat'], data['mass'], data['reclong'], 0.6, 1.0, 1.0);
    
    var octreeHelper = new Lore.OctreeHelper(lore, 'OctreeGeometry', 'default', pointHelper);
    octreeHelper.addEventListener('selectedchanged', function(e) {
        console.log(e);
    });
    octreeHelper.addEventListener('hoveredchanged', function(e) {
        console.log(e);
    });

    pointHelper.addFilter('hueRange', new Lore.InRangeFilter('color', 0, 0.22, 0.25));
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
        changeView: function(value) {
            switch(value) {
                case 'front':
                    lore.controls.setFrontView();
                    break;
                case 'top':
                    lore.controls.setTopView();
                    break;
                case 'back':
                    lore.controls.setBackView();
                    break;
                case 'left':
                    lore.controls.setLeftView();
                    break;
                case 'right':
                    lore.controls.setRightView();
                    break;
                case 'free':
                    lore.controls.setFreeView();
                    break;
            };
        },
        zoomIn: function() {
            lore.controls.zoomIn();
        },
        zoomOut: function() {
            lore.controls.zoomOut();
        },
        filter: function(e) {
            if (!pointHelper) {
                return;
            }

            let value = e.target.value;
            let filter = pointHelper.getFilter('hueRange');

            if (value < 0.025) {
                filter.reset();
                return;
            }

            value = Lore.Color.gdbHueShift(value);

            filter.setMin(value - 0.025);
            filter.setMax(value + 0.025);

            console.log('filtering', value - 0.025, value + 0.025);
            filter.filter();
        }
    }
});