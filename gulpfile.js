const gulp = require("gulp"),
  path = require("path"),
  plugins = require("gulp-load-plugins")(),
  browserify = require("browserify"),
  babelify = require("babelify"),
  bs = require("browser-sync").create();

const config = {
  debug: true,
  run: {
    browserSync: true
  },
  buildPath: "./dist",
  srcs: {
    templates: "./src/templates/**/*.jade",
    indexStyle: "./src/styles/index.styl",
    styles: "./src/styles/**/*.styl",
    scripts: "./src/app/**/*.js",
    app: "./src/app/index.js",
    fonts: "./src/assets/fonts/**/*.ttf"
  }
};

gulp.task("templates", function() {

  gulp.src(config.srcs.templates)
    .pipe(plugins.jade())
    .pipe(gulp.dest(config.buildPath));

  if (config.run.browserSync && bs.active) {
    bs.reload("*.html");
  }

});

gulp.task("lint", function() {

  gulp.src(config.srcs.scripts)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());

});

gulp.task("fonts", function() {

  gulp.src(config.srcs.fonts)
    .pipe(plugins.ttf2woff2())
    .pipe(gulp.dest(config.buildPath + "/fonts/"));
});

gulp.task("styles", function() {

  gulp.src(config.srcs.indexStyle)
    .pipe(plugins.stylus({
      debug: config.debug
    }))
    .pipe(gulp.dest(config.buildPath));

  if (config.run.browserSync && bs.active) {
    bs.reload("*.css");
  }

});

gulp.task("scripts", ["lint"], function() {
/*
  browserify()
    .add(config.srcs.app, { debug: config.debug })
    .transform(babelify)
    .bundle()
    .pipe(gulp.dest(config.buildPath));

  if (config.run.browserSync && bs.active) {
    bs.reload("*.js");
  }
*/
});

gulp.task("watch", ["templates", "styles", "scripts", "fonts"], function() {

  gulp.watch(config.srcs.fonts, ["fonts"]);
  gulp.watch(config.srcs.templates, ["templates"]);
  gulp.watch(config.srcs.styles, ["styles"]);
  gulp.watch(config.srcs.scripts, ["scripts"]);

  if (config.run.browserSync) {

    bs.init({
      server: {
        baseDir: config.buildPath
      }
    });

  }
});

gulp.task("default", ["watch"]);
