(function () {
  let lore = Lore.init('lore', {
    clearColor: '#222222', preserveDrawingBuffer: true,
    alphaBlending: true
  });

  let dlButton = document.getElementById('btn-download');
  dlButton.addEventListener('click', function (e) {
    let canvas = document.getElementById('lore');
    let dataURL = canvas.toDataURL('image/png');
    dlButton.href = dataURL;
  });

  let fileReader = new Lore.IO.CsvFileReader('input-upload', {
    cols: [0, 1, 2, 3],
    types: ['Uint16Array', 'Uint16Array', 'Uint16Array', 'Float32Array']
  });

  let pointHelper = null;
  let octreeHelper = null;
  let original_data = null;

  fileReader.addEventListener('loaded', function (data) {
    original_data = data;

    pointHelper = new Lore.Helpers.PointHelper(lore, 'Seppli', 'smoothCircle');
    pointHelper.setPositionsXYZHSS(data['x'], data['y'], data['z'], data['c'], 1.0, 1.0)
    pointHelper.setPointScale(1.0);
    pointHelper.setFog([0.05, 0.05, 0.05, 1.0], 6.0);
    pointHelper.addFilter('hueRange', new Lore.Filters.InRangeFilter('color', 0, 0.22, 0.25));

    lore.controls.setLookAt(pointHelper.getCenter());
    lore.controls.setRadius(pointHelper.getMaxRadius());

    octreeHelper = new Lore.Helpers.OctreeHelper(lore, 'OctreeGeometry', 'tree', pointHelper, {
      visualize: false
    });

    octreeHelper.addEventListener('selectedchanged', e => {
      console.log(e);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 48) {
      let filter = pointHelper.getFilter('hueRange');
      filter.reset();
    } else if (e.keyCode === 49) {
      let filter = pointHelper.getFilter('hueRange');
      filter.setMin(0.0);
      filter.setMax(0.05);
      filter.filter();
    } else if (e.keyCode == 50) {
      let filter = pointHelper.getFilter('hueRange');
      filter.setMin(0.05);
      filter.setMax(0.15);
      filter.filter();
    } else if (e.keyCode == 51) {
      let filter = pointHelper.getFilter('hueRange');
      filter.setMin(0.15);
      filter.setMax(0.25);
      filter.filter();
    } else if (e.keyCode == 52) {
      let filter = pointHelper.getFilter('hueRange');
      filter.setMin(0.35);
      filter.setMax(0.45);
      filter.filter();
    } else if (e.keyCode == 53) {
      let filter = pointHelper.getFilter('hueRange');
      filter.setMin(0.55);
      filter.setMax(0.65);
      filter.filter();
    } else if (e.keyCode == 54) {
      let filter = pointHelper.getFilter('hueRange');
      filter.setMin(0.75);
      filter.setMax(0.85);
      filter.filter();
    } else if (e.keyCode == 55) {
      
    } else if (e.keyCode == 56) {

    } else if (e.keyCode == 57) {

    } else if (e.keyCode == 58) {

    } else if (e.keyCode == 59) {

    }
  });
})();