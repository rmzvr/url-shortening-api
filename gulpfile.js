const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const urlprefixer = require('gulp-url-prefixer');
const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const image = require('gulp-image');
const del = require('del');
const sync = require('browser-sync').create();
const deploy = require('gulp-gh-pages');
const util = require('gulp-util');
const path = require('path');
const sass = require('gulp-dart-sass');

sass.compiler = require('sass');

const rootPath = path.basename(__dirname);

const html = () => {
    return gulp.src('src/*.html')
        .pipe(util.env.prod ? urlprefixer.html({
            prefix: `/${rootPath}`,
            tags: ['script', 'link', 'img', 'a']
        }) : util.noop())
        .pipe(gulp.dest('build'))
}

const fonts = () => {
    return gulp.src('src/fonts/**/*.ttf')
        .pipe(gulp.dest('build/fonts'))
}

const styles = () => {
    return gulp.src('src/styles/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(util.env.prod ? autoprefixer() : util.noop())
        .pipe(util.env.prod ? cssnano() : util.noop())
        .pipe(util.env.prod ? urlprefixer.css({
            prefix: `/${rootPath}`
        }) : util.noop())
        .pipe(gulp.dest('build/styles'))
}

const scripts = () => {
    return gulp.src('src/scripts/*.js')
        .pipe(babel({
            plugins: ['@babel/transform-runtime']
        }))
        .pipe(util.env.prod ? uglify() : util.noop())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('build/scripts'))
}

const images = () => {
    return gulp.src('src/images/**/*')
        .pipe(util.env.prod ? image() : util.noop())
        .pipe(gulp.dest('build/images'))
}

const server = () => {
    sync.init({
        server: {
            baseDir: "build"
        },
        notify: false
    });
    sync.watch('build', sync.reload);
}

function deleteBuild() {
    return del('build');
}

const deployBuild = () => {
    return gulp.src("build/**/*")
        .pipe(deploy())
}

const watch = () => {
    gulp.watch('src/*.html', html);
    gulp.watch('src/fonts/*.ttf', fonts);
    gulp.watch('src/styles/**/*.scss', styles);
    gulp.watch('src/scripts/*.js', scripts);
    gulp.watch('src/images/**/*.*', images);
}

exports.default = gulp.series(
    deleteBuild,
    gulp.parallel(html, fonts, styles, scripts, images),
    gulp.parallel(watch, server)
)

exports.build = gulp.series(
    deleteBuild,
    gulp.parallel(html, fonts, styles, scripts, images),
    deployBuild
)