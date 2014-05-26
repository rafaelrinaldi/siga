var gulp = require('gulp'),
    connect = require('gulp-connect'),
    rjs = require('requirejs').optimize,
    preprocess = require('gulp-preprocess'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    env = process.env.NODE_ENV || 'development',
    paths = {
      output: './public',

      partials: {
        index: './app/assets/partials/index.html',
        all: './app/assets/partials/**/*.html'
      },

      stylesheets: {
        manifest: './app/assets/stylesheets/application.scss',
        all: './app/assets/stylesheets/**/*.scss'
      },

      javascripts: {
        root: './app/assets/javascripts',
        manifest: './app/assets/javascripts/application.js',
        all: './app/assets/javascripts/**/*.js'
      }
    };

gulp.task('sass', function() {
  var config = {
    sass: {
    },
    autoprefixer: {
      cascade: true
    }
  };

  if(/prod/.test(env)) {
    config.sass.outputStyle = 'compressed';
  }

  gulp.src(paths.stylesheets.manifest)
      .pipe(sass(config.sass))
      .pipe(autoprefixer(config.autoprefixer))
      .pipe(gulp.dest(paths.output))
      .pipe(connect.reload());
});

gulp.task('js', function() {
  var config = {
    logLevel: 1,
    baseUrl: paths.javascripts.root,
    mainConfigFile: paths.javascripts.manifest,
    name: 'application',
    out: './public/application.js',
    optimize: 'uglify2',
    stubModules: ['text'],
    preserveLicenseComments: false
  };

  function handleError(error) {
    console.log(error);
  }

  if(/dev/.test(env)) {
    config.optimize = 'none';
  }

  rjs(config, connect.reload, handleError);
});

gulp.task('html', function() {
  gulp.src(paths.partials.index)
      .pipe(preprocess())
      .pipe(gulp.dest(paths.output))
      .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(paths.partials.all, ['html']);
  gulp.watch(paths.stylesheets.all, ['sass']);
  gulp.watch(paths.javascripts.all, ['js']);
});

gulp.task('connect', function() {
  connect.server({
    root: ['./'],
    port: 9000,
    livereload: true
  });
});

gulp.task('default', ['html', 'sass', 'js', 'watch', 'connect']);
