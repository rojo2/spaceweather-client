"use strict";

const gulp = require("gulp"),
  path = require("path"),
  plugins = require("gulp-load-plugins")(),
  browserify = require("browserify"),
  babelify = require("babelify"),
  source = require("vinyl-source-stream"),
  proxy = require("proxy-middleware"),
  url = require("url"),
  fs = require("fs"),
  bs = require("browser-sync").create();

const config = {
  debug: true,
  run: {
    browserSync: true
  },
  build: {
    path: "./dist",
    fonts: "./dist/fonts/",
    sounds: "./dist/sounds/",
    images: "./dist/images/"
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
    fonts: "./src/assets/fonts/**/*.ttf",
    sounds: "./src/assets/sounds/**/*.mp3",
    images: "./src/assets/images/**/*.*"
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
    .pipe(plugins.ttf2woff2())
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
  gulp.watch(config.srcs.images, ["images"]);
  gulp.watch(config.srcs.templates, ["templates"]);
  gulp.watch(config.srcs.styles, ["styles"]);
  gulp.watch(config.srcs.scripts, ["scripts"]);

  if (config.run.browserSync) {

    let proxyOptions = url.parse('http://localhost:3000/');
    proxyOptions.route = '/';

    bs.init({
      server: {
        baseDir: config.build.path,
        middleware(req, res, next) {
          let fileName = url.parse(req.url);
          fileName = fileName.href.split(fileName.search).join("");

          const fileExists = fs.existsSync(path.join(config.build.path, fileName));
          if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
            req.url = "/index.html";
          }
          return next();
        }
      }
    });
  }

});

gulp.task("build", ["templates", "styles", "scripts", "fonts", "images", "sounds"]);

gulp.task("default", ["watch"]);
