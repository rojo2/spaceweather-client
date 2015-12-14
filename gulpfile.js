"use strict";

const gulp = require("gulp"),
  path = require("path"),
  plugins = require("gulp-load-plugins")(),
  browserify = require("browserify"),
  babelify = require("babelify"),
  source = require("vinyl-source-stream"),
  bs = require("browser-sync").create();

const config = {
  debug: true,
  run: {
    browserSync: true
  },
  build: {
    path: "./dist",
    fonts: "./dist/fonts/"
  },
  index: {
    script: "./src/app/index.js",
    template: "./src/templates/index.jade",
    style: "./src/styles/index.styl"
  },
  srcs: {
    scripts: "./src/app/**/*.js",
    templates: "./src/templates/**/*.jade",
    styles: "./src/styles/**/*.styl",
    fonts: "./src/assets/fonts/**/*.ttf"
  }
};

gulp.task("templates", () => {

  const stream = gulp.src(config.index.template)
    .pipe(plugins.jade())
    .pipe(gulp.dest(config.build.path));

  if (config.run.browserSync && bs.active) {
    stream.pipe(bs.stream());
  }

});

gulp.task("styles:lint", () => {

  gulp.src(config.srcs.styles)
    .pipe(plugins.stylint({ config: ".stylintrc" }))
    .pipe(plugins.stylint.reporter());

});

gulp.task("scripts:lint", () => {

  gulp.src(config.srcs.scripts)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());

});

gulp.task("fonts", () => {

  gulp.src(config.srcs.fonts)
    .pipe(plugins.ttf2woff2())
    .pipe(gulp.dest(config.build.fonts));

});

gulp.task("styles", () => {

  const stream = gulp.src(config.index.style)
    .pipe(plugins.stylus({
      debug: config.debug
    }))
    .pipe(gulp.dest(config.build.path));

  if (config.run.browserSync && bs.active) {
    stream.pipe(bs.stream());
  }

});

gulp.task("scripts", () => {

  const stream = browserify()
    .add(config.index.script, { debug: config.debug })
    .transform(babelify)
    .bundle()
    .pipe(source(path.basename(config.index.script)))
    .pipe(gulp.dest(config.build.path));

  if (config.run.browserSync && bs.active) {
    stream.pipe(bs.stream());
  }

});

gulp.task("watch", ["build"], () => {

  gulp.watch(config.srcs.fonts, ["fonts"]);
  gulp.watch(config.srcs.templates, ["templates"]);
  gulp.watch(config.srcs.styles, ["styles"]);
  gulp.watch(config.srcs.scripts, ["scripts"]);

  if (config.run.browserSync) {
    bs.init({
      server: {
        baseDir: config.build.path
      }
    });
  }

});

gulp.task("build", ["templates", "styles", "scripts", "fonts"]);

gulp.task("default", ["watch"]);
