/**
 * # Grunt
 * A task manager for auto compiling and validating code
 *
 * ## Set up
 * Make sure the you have nodejs running on your machine
 * Install Grunt with npm `npm install -g grunt-cli`
 * Install Grunt packages `npm install`
 *
 * ## Config
 * The configuration settings are found in `package.json`.
 *
 * ## Running
 * You can type `grunt <command>` to run any of rules in the `initConfig` function
 * e.g. `grunt compass` to compile the scss files to css
 *
 * You can also run a sub-task by adding `:<subtask>`
 * e.g. `grunt uglify:js` to compile to javaScript header file
 *
 * ## Helper Commands
 * There are a number of helper command at the end of the file
 * - default (`grunt`) will watch the folder and compile when files are saved
 */

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
  'use strict';

  // require it at the top and pass in the grunt instance
  require('time-grunt')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '<%= pkg.name %> by <%= pkg.author %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)',
      bannerJS:
      '/*\n' +
      ' * <%= meta.banner %>\n' +
      ' */'
    },

    clean: {
      build: ["src/js-min/*", "src/css/*", "src/css-min/*"]
    },

    compass: {
      dist: {
        options: {
          config: 'config.rb',
          sourcemap: true
        }
      }
    },

    concat: {
      js: {
        options: {
          separator: ';\n\r',
          sourceMap: true
        },
        src: [
          'src/js/app.js'
        ],
        dest: 'src/js/app.pkgd.js'
      },
      cssFonts: {
        options: {
          separator: '\n\r'
        },
        src: [
          'src/fonts/style.css'
        ],
        dest: 'src/scss/_fonts.scss'
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 100 version'],
        map: true
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'src/css/*.css',
        dest: 'src/css/'
      }
    },

    csswring: {
      options: {
        banner: '<%= meta.banner %>\n',
        map: true,
        preserveHacks: true
      },
      minify: {
        expand: true,
        flatten: true,
        src: ['src/css/**/*.css'],
        dest: 'src/css-min/'
      }
    },

    uglify: {
      js: {
        options: {
          banner: '<%= meta.bannerJS %>\n',
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'src/js/',
          src: 'src/**/*.js',
          dest: 'src/js-min/'
        }]
      }
    },

    dalek: {
      options: {
        // invoke phantomjs, chrome & chrome canary ...
        browser: ['phantomjs', 'chrome', 'ie'],
        // generate an html & an jUnit report
        reporter: ['html', 'junit']
      },
      dist: {
        src: ['src/tests/dalek/*.js']
      }
    },
    // TODO: Configure dest and src
    assemble: {
		  options: {
		    assets: 'assets',
		    plugins: ['permalinks'],
		    partials: ['src/includes/**/*.hbs'],
		    layout: ['src/components/layout/default.hbs'],
		    data: ['src/data/*.{json,yml}']
		  },
		  site: {
		    src: ['docs/*.hbs'],
		    dest: './'
		  }
		},

    watch: {

			html: {
        files: ['*.html'],
        options: {
          livereload: true
      },
        }

      twig: {
        files: ['*.twig'],
        options: {
          livereload: true
        }
      },

      js: {
        files: ['js/*.js'],
        tasks: ['concat:js', 'uglify:js'],
        options: {
          livereload: true
        }
      },

      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['compass:dist', 'autoprefixer', 'csswring:minify'],
        options: {
          livereload: true,
          spawn : false       // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions.
        }
      }

    }

  });

  // load all plugins from the "package.json"-file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['watch', 'assemble']);

  grunt.registerTask('clean-build', ['clean:build']);
  grunt.registerTask('csswring' ['csswring:minify']);
  grunt.registerTask('image-min', ['imagemin:dynamic']);
  grunt.registerTask('test', ['dalek']);

  grunt.registerTask(
      'build',
      'Build this website ... yeaahhh!',
      [ 'clean:build', 'concat:js', 'uglify:js', 'concat:cssFonts', 'compass:dist', 'autoprefixer', 'csswring:minify', 'assemble']
  );

};
