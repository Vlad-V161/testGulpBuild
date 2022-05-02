const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const soursemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const browsersync = require('browser-sync').create()

// const { dest } = require('gulp')


const path = {
    styles: {
        src: 'src/styles/**/*.sass',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/'

    },
    html: {
        src: 'src/*.html',
        dest: 'dist'
    }
}

function clean() {
    return del(['dist'])
}

function styles() {
    return gulp.src(path.styles.src)
        .pipe(soursemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(soursemaps.write('.'))
        .pipe(size())
        .pipe(gulp.dest(path.styles.dest))
        .pipe(browsersync.stream());
}

function scripts() {
    return gulp.src(path.scripts.src)
        .pipe(soursemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(soursemaps.write('.8'))
        .pipe(size())
        .pipe(gulp.dest(path.scripts.dest))
        .pipe(browsersync.stream());
}


  function html() {
    return gulp.src(path.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(gulp.dest(path.html.dest))
    .pipe(browsersync.stream())
  }

function watch() {
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    })
    gulp.watch(path.html.dest).on('change', browsersync.reload)
    gulp.watch(path.html.src, html) 
    gulp.watch(path.styles.src, styles)
    gulp.watch(path.scripts.src, scripts)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts), watch)

exports.clean = clean
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build
exports.html = html
