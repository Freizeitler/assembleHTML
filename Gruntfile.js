/*
 * assemble-pattern-lab <https://github.com/assemble/assemble-pattern-lab>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  'use strict';
  // require it at the top and pass in the grunt instance
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Project metadata
    pkg: grunt.file.readJSON('package.json'),

    /**
     * START: Assemble Part
     */
    // <%= site %> metadata comes from this file
    site: grunt.file.readYAML('.assemble.yml'),

    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.assets %>',

        // Metadata
        pkg: '<%= pkg %>',
        site: '<%= site %>',
        data: ['<%= site.data %>/**/*.json'],
        helpers: ['<%= site.helpers %>/*.js'],
        plugins: '<%= site.plugins %>',

        // General templates
        partials: ['<%= site.includes %>/**/*.hbs'],
        layouts: '<%= site.layouts %>',
        layoutext: '<%= site.layoutext %>',
        layout: '<%= site.layout %>',

        // Pattern Lab templates
        patterns: {
          atoms: ['<%= site.atoms %>/**/*.hbs'],
          molecules: ['<%= site.molecules %>/**/*.hbs'],
          organisms: ['<%= site.organisms %>/**/*.hbs'],
          templates: ['<%= site.templates %>/**/*.hbs'],
        }
      },

      // 'pages' are specified in the src
      site: {
        src: ['<%= site.pages %>/*.hbs', 'src/*.hbs'],
        dest: '<%= site.dest %>/'
      },

      patterns: {
        options: {
          permalinks: {
            preset: 'pretty',
            structure: ':pattern-:group',
            patterns: [
              {
                pattern: /:pattern/,
                replacement: function(src) {
                  return this.src.split('/')[1];
                }
              },
              {
                pattern: /:group/,
                replacement: function(src) {
                  return this.src.split('/')[2];
                }
              }
            ]
          }
        },
        src: ['<%= site.patterns %>/**/*.hbs'],
        dest: '<%= site.dest %>/patterns/'
      }/*,
      copy: {
			  main: {
			    files: [
			      // includes files within path
			      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

			      // includes files within path and its sub-directories
			      {expand: true, src: ['path/**'], dest: 'dest/'},

			      // makes all src relative to cwd
			      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

			      // flattens results to a single level
			      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
			    ],
			  },
			}*/
    },
    /**
     * END: Assemble Part
     */

    clean: {
      examples: ['<%= assemble.examples.dest %>/**'],
      build: ["js-min/*", "css/*", "css-min/*"]
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
          'js/app.js'
        ],
        dest: 'js/app.pkgd.js'
      },
      cssFonts: {
        options: {
          separator: '\n\r'
        },
        src: [
          'fonts/style.css'
        ],
        dest: 'scss/_fonts.scss'
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
        src: 'css/*.css',
        dest: 'css/'
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
        src: ['css/**/*.css'],
        dest: 'css-min/'
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
          cwd: 'js/',
          src: '**/*.js',
          dest: 'js-min/'
        }]
      }
    },

    watch: {

			html: {
        files: ['*.html'],
        options: {
          livereload: true
        }
      },

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

  // Load Assemble
  grunt.task.loadNpmTasks('assemble');
  // load all plugins from the "package.json"-file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // The default task to run with the `grunt` command
  //grunt.registerTask('assemble', ['assemble']);
  grunt.registerTask('default', ['watch', 'assemble']);

  grunt.registerTask('clean-build', ['clean:build']);
  grunt.registerTask('csswring', ['csswring:minify']);

  grunt.registerTask(
      'build',
      'Build this website ... yeaahhh!',
      [ 'clean:build', 'concat:js', 'uglify:js', 'concat:cssFonts', 'compass:dist', 'autoprefixer', 'csswring:minify']
  );
};
