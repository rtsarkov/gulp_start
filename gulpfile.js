"use strict"

var gulp = require('gulp'),
	server = require('browser-sync').create(),
	rimraf = require('rimraf'),
	watch = require('gulp-watch'),
	include = require('gulp-include'),
	gulpif = require('gulp-if'),
	plumber = require('gulp-plumber'),
	wait = require('gulp-wait'),
	rename = require("gulp-rename"),
	// html
	pug = require('gulp-pug'),
	// images
	filter = require('gulp-filter'),
	imagemin = require('gulp-imagemin'),
	// js
	order = require('gulp-order'),
	concat = require('gulp-concat'),
	minify = require('gulp-minify'),
	jsValidate = require('gulp-jsvalidate'),
	// css
	prefixer = require('gulp-autoprefixer'),
	scss = require('gulp-sass'),
	scssGlob = require('gulp-sass-glob'),
	sourcemaps = require('gulp-sourcemaps'),
	cssnano = require('gulp-cssnano'),
	// png sprites
	spritesmith = require('gulp.spritesmith'),
	merge = require('merge-stream'),
	// svg
	svgSymbols = require('gulp-svg-symbols'),
	// modernizr
	mkdirp = require('mkdirp'),
	fs = require('fs'),
	mdrnzr = require('modernizr');

/* ==== SETTINGS ============================================================ */

var settings = {
	tasks: [
		'html',
		'js',
		'css',
		'fonts',
		'sprites',
		'images',
		'uploads',
		// 'modernizr',
		// 'sprites-png',
	],
	path: {
		root: __dirname,
		config: __dirname + '/source/.config',
		in: __dirname + '/source',
		out: __dirname + '/www/static', // static
		// out: __dirname + '/www/local/templates/main', // bitrix
	},
	server: {
		start: true,
		path: __dirname + '/www/static',
		host: 'localhost',
		port: 9000,
		tunnel: false,
		open: false, // 'tunnel'
		logLevel: 'silent', // 'info'
	},
	timeout: 0,
	cssPrefixer: ['last 3 versions'],
	scssMaps: false,
	imageMin: false,
};

/* ==== TASKS =============================================================== */

// html
(() => {
	gulp.task('html:build', () => {
		let src = settings.path.in + '/html/pages/**/*';
		let dest = settings.path.out;

		let onlyPug = filter(['**/*.pug'], {
			restore: true
		});

		return gulp.src(src)
			.pipe(plumber())
			.pipe(onlyPug)
			.pipe(pug({ pretty: '\t' }))
			.pipe(onlyPug.restore)
			.pipe(gulp.dest(dest));
	});
	gulp.task('html:watch', () => {
		watch([
			settings.path.in + '/html/**/*',
			settings.path.in + '/images/sprites.svg'
		], () => {
			gulp.start('html:build', server.reload);
		});
	});
})();

// js
(() => {
	gulp.task('js:build', () => {
		let src = settings.path.in + '/js/**/*.js';
		let dest = settings.path.out + '/js';

		gulp.src(src)
			.pipe(plumber())
			.pipe(jsValidate())
			.pipe(include())
			.pipe(order([
				"plugins.js",
				"*.js"
			]))
			.pipe(concat('main.js'))
			.pipe(minify({
				ext: {
					src: '.js',
					min: '.min.js'
				}
			}))
			.pipe(gulp.dest(dest));
	});
	gulp.task('js:watch', () => {
		watch([
			settings.path.in + '/js/**/*.js'
		], () => {
			gulp.start('js:build', server.reload);
		});
	});
})();

// css
(() => {
	gulp.task('css:build', () => {
		let src = settings.path.in + '/scss/**/*.scss';
		let dest = settings.path.out;

		return gulp.src(src)
			.pipe(include())
			.pipe(gulpif(
				settings.scssMaps,
				sourcemaps.init()
			))
			.pipe(wait(settings.timeout)) // fix #8 (not atomic save)
			.pipe(scssGlob())
			.pipe(scss().on('error', scss.logError))
			.pipe(prefixer({
				browsers: settings.cssPrefixer
			}))
			.pipe(cssnano({
				zindex: false,
				discardUnused: {
					fontFace: false
				}
			}))
			.pipe(gulpif(
				settings.scssMaps,
				sourcemaps.write('.')
			))
			.pipe(gulp.dest(dest));
	});
	gulp.task('css:watch', () => {
		watch([
			settings.path.in + '/scss/**/*.scss'
		], () => {
			gulp.start('css:build', server.reload);
		});
	});
})();

// fonts
(() => {
	gulp.task('fonts:build', () => {
		let src = settings.path.in + '/fonts/**/*.{woff,woff2}';
		let dest = settings.path.out + '/fonts';

		return gulp.src(src)
			.pipe(gulp.dest(dest));
	});
	gulp.task('fonts:watch', () => {
		watch([
			settings.path.in + '/fonts/**/*.{woff,woff2}'
		], () => {
			gulp.start('fonts:build', server.reload);
		});
	});
})();

// images
(() => {
	gulp.task('images:build', () => {
		let src = settings.path.in + '/images/**/*.{jpg,jpeg,gif,png,svg}';
		let dest = settings.path.out + '/images';
		let excludeSvg = filter(['**', '!**/*.svg'], {
			restore: true
		});
		let onlySvg = filter(['**/*.svg'], {
			restore: true
		});

		setTimeout(() => {
			return gulp.src(src)
				.pipe(excludeSvg)
				.pipe(gulpif(
					settings.imageMin,
					imagemin({
						progressive: true,
						interlaced: true
					})
				))
				.pipe(excludeSvg.restore)
				.pipe(gulp.dest(dest));
		}, 1000);
	});
	gulp.task('images:watch', () => {
		watch([
			settings.path.in + '/images/**/*.{jpg,jpeg,gif,png,svg}',
		], () => {
			gulp.start('images:build', server.reload);
		});
	});
})();

// uploads
(() => {
	gulp.task('uploads:build', () => {
		let src = settings.path.in + '/uploads/**/*';
		let dest = settings.path.out + '/uploads';

		setTimeout(() => {
			return gulp.src(src)
				.pipe(gulp.dest(dest));
		}, 1000);
	});
	gulp.task('uploads:watch', () => {
		watch([
			settings.path.in + '/uploads/**/*'
		], () => {
			gulp.start('uploads:build', server.reload);
		});
	});
})();

// sprites
(() => {
	gulp.task('sprites:build', () => {
		var src = settings.path.in + '/sprites/**/*.svg';
		var destSvg = settings.path.in + '/images';
		var destScss = settings.path.in + '/scss';
		var destPug = settings.path.in + '/html';

		return gulp.src(src)
			.pipe(svgSymbols({
				svgAttrs: {
					'width': 0,
					'height': 0,
					'style': `position: absolute`,
					'aria-hidden': 'true'
				},
				id: 'icon-%f',
				class: '.icon.icon-%f',
				templates: [
					settings.path.config + '/sprites-template.scss',
					settings.path.config + '/sprites-template.svg',
					settings.path.config + '/sprites-template.pug'
				]
			}))
			.pipe(
				rename(function (path) {
					if (path.extname == '.scss') {
						path.basename = '_sprites';
					} else {
						path.basename = 'sprites';
					}
				})
			)
			.pipe(gulpif(/[.]svg$/, gulp.dest(destSvg)))
			.pipe(gulpif(/[.]scss$/, gulp.dest(destScss)))
			.pipe(gulpif(/[.]pug$/, gulp.dest(destPug)))
	});
	gulp.task('sprites:watch', () => {
		watch([
			settings.path.config + '/sprites-template.scss',
			settings.path.config + '/sprites-template.svg',
			settings.path.config + '/sprites-template.pug',
			settings.path.in + '/sprites/**/*.svg'
		], () => {
			gulp.start('sprites:build', server.reload);
		});
	});
})();

// modernizr
(() => {
	gulp.task('modernizr:build', () => {
		let config = require(settings.path.config + '/modernizr.json');
		let destDir = settings.path.out + '/js';
		let destFile = settings.path.out + '/js/modernizr.js';

		return mdrnzr.build(config, function (code) {
			mkdirp(destDir, function () {
				fs.writeFile(destFile, code, function () {
					console.log('modernizr callback');
				});
			});
		});
	});
	gulp.task('modernizr:watch', () => {
		watch([
			settings.path.config + '/modernizr.json'
		], () => {
			gulp.start('modernizr:build', server.reload);
		});
	});
})();

// sprites png
(() => {
	gulp.task('sprites-png:build', () => {
		let src = settings.path.in + '/sprites-png/**/*.{jpg,jpeg,gif,png}';
		let destImg = settings.path.in + '/images';
		let destCss = settings.path.in + '/scss';

		let spriteData = gulp.src(src)
			.pipe(spritesmith({
				imgName: 'sprites.png',
				imgPath: 'images/sprites.png', // in css
				cssName: '_sprites.scss',
				algorithm: 'binary-tree',
				padding: 1,
				cssVarMap: function (sprite) {
					sprite.name = 's-' + sprite.name;
				}
			}));

		let imgStream = spriteData.img
			.pipe(gulp.dest(destImg));
		let cssStream = spriteData.css
			.pipe(gulp.dest(destCss));

		return merge(imgStream, cssStream);
	});
	gulp.task('sprites-png:watch', () => {
		watch([
			settings.path.in + '/sprites-png/**/*.{jpg,jpeg,gif,png}'
		], () => {
			gulp.start('sprites-png:build', server.reload);
		});
	});
})();

/* ==== BASE TASKS =========================================================== */

// server
gulp.task('server', () => {
	if (!settings.server.start) return;
	server.init({
		server: {
			baseDir: settings.server.path
		},
		host: settings.server.host,
		port: settings.server.port,
		tunnel: settings.server.tunnel,
		open: settings.server.open,
		notify: false,
		logLevel: settings.server.logLevel,
		logPrefix: "server",
		middleware: function (req, res, next) {
			if (/\.json|\.txt|\.html/.test(req.url) && req.method.toUpperCase() == 'POST') {
				console.log('[POST => GET] : ' + req.url);
				req.method = 'GET';
			}
			next();
		}
	});
});

// clean "static"
gulp.task('clean', () => {
	rimraf(settings.path.root + '/www/static', function () {
		console.log('static clean');
	});
});

// default tasks
var tasksBuild = [];
var tasksWatch = [];
settings.tasks.forEach((item, i) => {
	tasksBuild[i] = item + ':build';
	tasksWatch[i] = item + ':watch';
});
gulp.task('build', tasksBuild);
gulp.task('watch', tasksWatch);
gulp.task('default', ['build', 'watch', 'server']);