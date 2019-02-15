const gulp = require("gulp");
const path = require("path");
const plugins = require("gulp-load-plugins")();
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const chaf = require("connect-history-api-fallback");
const url = require("url");
const fs = require("fs");
const bs = require("browser-sync");

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const config = {
  debug: (isDevelopment),
  run: { browserSync: (isDevelopment) },
  build: {
    path: "./dist",
    fonts: "./dist/fonts/",
    sounds: "./dist/sounds/",
    images: "./dist/images/"
  },
  other: {
    metadata: "./metadata.json",
    humans: "./humans.txt",
    robots: "./robots.txt"
  },
  index: {
    script: "./src/app/icarus/index.js",
    template: "./src/templates/index.pug",
    style: "./src/styles/index.styl"
  },
  srcs: {
    scripts: "./src/app/icarus/**/*.js",
    templates: "./src/templates/**/*.pug",
    styles: "./src/styles/**/*.styl",
    fonts: "./src/assets/fonts/**/*.ttf",
    sounds: "./src/assets/sounds/**/*.mp3",
    images: "./src/assets/images/**/*.*"
  }
};

gulp.task("other", () => {

  return gulp.src([
    config.other.humans,
    config.other.robots
  ]).pipe(gulp.dest(config.build.path));

});

gulp.task("templates", () => {

  return gulp.src(config.index.template)
    .pipe(plugins.pug({ locals: require(config.other.metadata) }))
    .pipe(gulp.dest(config.build.path));

});

gulp.task("styles:lint", () => {

  gulp.src(config.srcs.styles)
    .pipe(plugins.stylint({ config: ".stylintrc" }))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.stylint.reporter());

});

gulp.task("scripts:lint", () => {

  gulp.src(config.srcs.scripts)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());

});

gulp.task("fonts", () => {

  gulp.src(config.srcs.fonts)
    .pipe(plugins.ttf2woff())
    .pipe(gulp.dest(config.build.fonts));

});

gulp.task("sounds", () => {

  gulp.src(config.srcs.sounds)
    .pipe(gulp.dest(config.build.sounds));

});

gulp.task("images", () => {

  gulp.src(config.srcs.images)
    .pipe(gulp.dest(config.build.images));

});

gulp.task("styles", () => {

  return gulp.src(config.index.style)
    .pipe(plugins.stylus({
      compress: !config.debug
    }))
    .pipe(gulp.dest(config.build.path));

});

gulp.task("scripts", () => {

  return browserify({
    paths: ["src/app"],
    debug: config.debug
  }).add(config.index.script)
    .transform("babelify")
    .transform("uglifyify", {
      global: true,
      mangle: isProduction,
      compress: isProduction,
      sourcemap: isDevelopment
    })
    .bundle()
    .pipe(source(path.basename(config.index.script)))
    .pipe(gulp.dest(config.build.path));

});

gulp.task("bs", ["watch"], () => {

  if (config.run.browserSync) {
    bs.init({
      server: {
        baseDir: config.build.path,
        middleware: [chaf()]
      }
    });
  }

});

gulp.task("watch", ["build"], () => {

  gulp.watch(config.srcs.fonts, ["fonts"]);
  gulp.watch(config.srcs.images, ["images"]);
  gulp.watch(config.srcs.templates, ["templates", bs.reload]);
  gulp.watch(config.srcs.styles, ["styles", bs.reload]);
  gulp.watch(config.srcs.scripts, ["scripts", bs.reload]);

});

gulp.task("build", [
  "templates",
  "styles",
  "scripts",
  "fonts",
  "images",
  "sounds",
  "other"
]);

gulp.task("default", ["bs"]);
