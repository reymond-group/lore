(function() {
    let lore = Lore.init('lore', {
        clearColor: '#222222'
    });
    
    let fileReader = new Lore.CsvFileReader('input-upload');

    fileReader.addEventListener('loaded', function(data) {
        let pointHelper = new Lore.PointHelper(lore, 'FlyBaby', 'default');
        Lore.Statistics.normalize(data['Sytox Green']);
        console.log(data['Sytox Green']);
        pointHelper.setPositionsXYZHSS(data['x'], data['y'], data['z'], 0.8, data['Sytox Green'], 5.0);
    });

})();