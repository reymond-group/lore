(function() {
    let lore = Lore.init('lore', {
        clearColor: '#222222'
    });
    
    let fileReader = new Lore.CsvFileReader('input-upload');
    let pointHelper = null;
    let octreeHelper = null;
    let original_data = null;

    fileReader.addEventListener('loaded', function(data) {
        original_data = data;

        pointHelper = new Lore.PointHelper(lore, 'FlyBaby', 'default');

        //let norm = Lore.Statistics.normalize(data['Sytox Green']);
        let norm = 1.0;

        for (var i = 0; i < data['z'].length; i++) {
            data['z'][i] *= 10;
        }

        pointHelper.setPositionsXYZHSS(data['x'], data['y'], data['z'], 0.8, norm, 1.0);
        pointHelper.setPointScale(2.0);
        pointHelper.setFogDistance(0, 500);
        
        lore.controls.setLookAt(pointHelper.getCenter());

        octreeHelper = new Lore.OctreeHelper(lore, 'OctreeGeometry', 'tree', pointHelper, {
            visualize: false //'cubes'
        });

        octreeHelper.addEventListener('hoveredchanged', function(e) {
            let indicator = document.getElementById('indicator');
            let data = document.getElementById('data');

            if (e.e) {
                indicator.style.opacity = 1.0;
                indicator.style.left = (e.e.screenPosition[0] - 18) + 'px';
                indicator.style.top = (e.e.screenPosition[1] - 90) + 'px';
                data.innerHTML = original_data['x'][e.e.index];
            } else {
                indicator.style.opacity = 0.0;
                data.innerHTML = '';
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 48) {
            let norm = Lore.Statistics.normalize(original_data['Sytox Green']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(norm);
            pointHelper.setPointScale(1.0);
        } else if (e.keyCode === 49) {
            let norm = Lore.Statistics.normalize(original_data['Sytox Green']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 50) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_nuclear']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(norm);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 51) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_apical']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 52) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_basal']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 53) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_cell']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 54) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_nuclear']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 55) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_apical']);
            pointHelper.setSaturation(norm);
            pointHelper.setPointScale(10.0);
        } else if (e.keyCode == 56) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_basal']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 57) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_cell']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 58) {
            let norm = Lore.Statistics.normalize(original_data['density_15']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        } else if (e.keyCode == 59) {
            let norm = Lore.Statistics.normalize(original_data['density_30']);
            pointHelper.setSaturation(norm);
            pointHelper.setSize(1.0);
            pointHelper.setPointScale(5.0);
        }
    });
})();