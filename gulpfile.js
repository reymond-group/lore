var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jsdoc = require('gulp-jsdoc3');
var gulpJsdoc2md = require('gulp-jsdoc-to-markdown');
var gutil = require('gulp-util');

// Currently, files have to be in order
var files = [
    'src/Lore.js',
    'src/Core/DrawModes.js',
    'src/Core/Color.js',
    'src/Core/Renderer.js',
    'src/Core/Shader.js',
    'src/Core/Uniform.js',
    'src/Core/Node.js',
    'src/Core/Geometry.js',
    'src/Core/Attribute.js',
    'src/Core/Effect.js',
    'src/Controls/ControlsBase.js',
    'src/Controls/OrbitalControls.js',
    'src/Controls/FirstPersonControls.js',
    'src/Cameras/CameraBase.js',
    'src/Cameras/OrthographicCamera.js',
    'src/Cameras/PerspectiveCamera.js',
    'src/Math/Array2.js',
    'src/Math/Array3.js',
    'src/Math/Vector2f.js',
    'src/Math/Vector3f.js',
    'src/Math/Matrix3f.js',
    'src/Math/Matrix4f.js',
    'src/Math/Quaternion.js',
    'src/Math/SphericalCoords.js',
    'src/Math/ProjectionMatrix.js',
    'src/Math/Statistics.js',
    'src/Math/Ray.js',
    'src/Math/RadixSort.js',
    'src/Helpers/HelperBase.js',
    'src/Helpers/PointHelper.js',
    'src/Helpers/TreeHelper.js',
    'src/Helpers/CoordinatesHelper.js',
    'src/Helpers/OctreeHelper.js',
    'src/Filters/FilterBase.js',
    'src/Filters/InRangeFilter.js',
    'src/IO/FileReaderBase.js',
    'src/IO/CsvFileReader.js',
    'src/IO/MatrixFileReader.js',
    'src/Utils/Utils.js',
    'src/Shaders/Default.js',
    'src/Shaders/DefaultAnimated.js',
    'src/Shaders/Coordinates.js',
    'src/Shaders/Tree.js',
    'src/Shaders/Circle.js',
    'src/Shaders/SimpleSphere.js',
    'src/Shaders/Sphere.js',
    'src/Shaders/DefaultEffect.js',
    'src/Shaders/FXAAEffect.js',
    'src/Spice/Octree.js',
    'src/Spice/AABB.js',
    'src/Spice/Raycaster.js',
    'src/UI/UI.js' ]

    var filesInclMd = files.slice();

    gulp.task('default', [ 'build', 'doc', 'md' ]);

    gulp.task('build', function() {
        return gulp.src(files)
            .pipe(concat('lore.js'))
            .pipe(babel({ presets: ['es2015'] }))
            .pipe(gulp.dest('./dist/'))
            .pipe(uglify())
            .pipe(rename({ extname: '.min.js' }))
            .pipe(gulp.dest('./dist/'));
    });


gulp.task('doc', function (cb) {
    var config = require('./jsdocConfig.json');
    var paths = filesInclMd.slice();
    paths.push('README.md');
    gulp.src(paths, {read: false})
        .pipe(jsdoc(config, cb))
});

gulp.task('md', function (cb) {
    var config = require('./jsdocConfig.json');
    gulp.src(files)
        .pipe(concat('all.md'))
        .pipe(gulpJsdoc2md({ template: fs.readFileSync('./readme.hbs', 'utf8') }))
        .on('error', function(err) {
            gutil.log(gutil.colors.red('jsdoc2md failed'), err.message);
        })
    .pipe(rename(function(path) {
        path.extname = '.md';
    }))
    .pipe(gulp.dest('doc'));
});
