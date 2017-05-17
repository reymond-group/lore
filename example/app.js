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
var names = [];

csvReader.addEventListener('loaded', function(data) {
    pointHelper = new Lore.PointHelper(lore, 'TestGeometry', 'sphere');
    pointHelper.geometry.isVisible = true;
    console.log(data);
    names = data['name'];

    for (var i = 0; i < data['mass'].length; i++) {
        data['mass'][i] = Math.sqrt(data['mass'][i]);
    }

    pointHelper.setPositionsXYZHSS(data['reclat'], data['mass'], data['reclong'], data['year'], 1.0, 1.0);
    
    var octreeHelper = new Lore.OctreeHelper(lore, 'OctreeGeometry', 'default', pointHelper);
    octreeHelper.addEventListener('selectedchanged', function(e) {
        console.log(e);
    });
    octreeHelper.addEventListener('hoveredchanged', function(e) {
        if (e.e !== null) {
            app.hoveredValue = names[e.e.index];
        }
    });

    pointHelper.addFilter('hueRange', new Lore.InRangeFilter('color', 0, 0.22, 0.25));
});

document.getElementById('cutoff-button').addEventListener('click', function() {
    var val = document.getElementById('cutoff').value;
    pointHelper.setCutoff(val);
});

var app = new Vue({
    el: '#app',
    data: {
        hoveredValue: '',
        fogStart: 0,
        fogEnd: 500,
        radius: 500,
        lookAtX: lore.controls.getLookAt().getX(),
        lookAtY: lore.controls.getLookAt().getY(),
        lookAtZ: lore.controls.getLookAt().getZ()
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
            filter.filter();
        },
        updateFog: function(e) {
            if (!pointHelper) {
                return;
            }

            pointHelper.setFogDistance(this.fogStart, this.fogEnd);
        },
        updateRadius: function(e) {
            if (!pointHelper) {
                return;
            }

            let value = e.target.value;

            lore.controls.setRadius(value);
        },
        updateLookAt: function(e) {
            lore.controls.setLookAt(new Lore.Vector3f(this.lookAtX, this.lookAtY, this.lookAtZ));
        }
    }
});

lore.controls.addEventListener('updated', function() {
    let lookAt = lore.controls.getLookAt();

    app.lookAtX = lookAt.getX();
    app.lookAtY = lookAt.getY();
    app.lookAtZ = lookAt.getZ();
});