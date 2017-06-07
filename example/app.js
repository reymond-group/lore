(function() {
    let lore = Lore.init('lore', {
        clearColor: '#222222'
    });
    
    let fileReader = new Lore.CsvFileReader('input-upload');
    let pointHelper = null;
    let original_data = null;

    fileReader.addEventListener('loaded', function(data) {
        original_data = data;

        pointHelper = new Lore.PointHelper(lore, 'FlyBaby', 'default');
        let norm = Lore.Statistics.normalize(data['Sytox Green']);

        pointHelper.setPositionsXYZHSS(data['x'], data['y'], data['z'], 0.8, norm, 1.0);
        pointHelper.setPointSize(5.0);
        pointHelper.setFogDistance(1500, 2250);
        // Center of gravity
        lore.camera.setLookAt(pointHelper.getCenter());
    });

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 49) {
            let norm = Lore.Statistics.normalize(original_data['Sytox Green']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 50) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_nuclear']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 51) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_apical']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 52) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_basal']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 53) {
            let norm = Lore.Statistics.normalize(original_data['Coumarin_cell']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 54) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_nuclear']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 55) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_apical']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 56) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_basal']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 57) {
            let norm = Lore.Statistics.normalize(original_data['Cy3_cell']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 58) {
            let norm = Lore.Statistics.normalize(original_data['density_15']);
            pointHelper.setSaturation(norm);
        } else if (e.keyCode == 59) {
            let norm = Lore.Statistics.normalize(original_data['density_30']);
            pointHelper.setSaturation(norm);
        }
    });
})();