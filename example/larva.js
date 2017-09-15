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
        pointHelper = new Lore.PointHelper(lore, 'FlyBaby', 'sphere');
        pointHelper.setPositionsXYZHSS(data['x'], data['y'], data['z'], Lore.Statistics.normalize(original_data['Coumarin_basal']), 1.0, 1.0)
        pointHelper.setPointScale(5.0);
        pointHelper.setFogDistance(500, 2000);
        
        lore.controls.setLookAt(pointHelper.getCenter());

        octreeHelper = new Lore.OctreeHelper(lore, 'OctreeGeometry', 'tree', pointHelper);

        octreeHelper.addEventListener('hoveredchanged', function(e) {
            let indicator = document.getElementById('indicator');
            let data = document.getElementById('data');

            if (e.e) {
                indicator.style.opacity = 1.0;
                indicator.style.left = (e.e.screenPosition[0] - 18) + 'px';
                indicator.style.top = (e.e.screenPosition[1] - 90) + 'px';
                data.innerHTML = e.e.index;
            } else {
                indicator.style.opacity = 0.0;
                data.innerHTML = '';
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 48) {
            let norm = Lore.Statistics.normalize(original_data['Sytox Green']);
            pointHelper.setHue(norm);
        } else if (e.keyCode === 49) {
            let norm = Lore.Statistics.normalize(original_data['Sytox Green']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 50) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_nuclear']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 51) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_apical']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 52) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_basal']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 53) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_cell']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 54) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_nuclear']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 55) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_apical']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 56) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_basal']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 57) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_cell']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 58) {
            let norm = Lore.Statistics.normalize(original_data['density_15']);
            pointHelper.setHue(norm);
        } else if (e.keyCode == 59) {
            let norm = Lore.Statistics.normalize(original_data['density_30']);
            pointHelper.setHue(norm);
        }
    });
})();