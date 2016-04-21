module.exports = function(grunt) {

	// Register Tasks
	grunt.registerTask( 
		'default', 
		[ 
			'clean:targetIncludes', // clean target
			'sass:distTheme', // sass compilation
			'cssmin', // css minifications
			'clean:themecss', // cleanup combined css
			'rev:css', // create revision cache buster
			'clean:mincss', // clean min version
			'injector:css', // inject css location
			'uglify:libraries', // uglify JS libraries
			'uglify:contentboxJS',
			'copy:js',
			'copy:fonts',
			'copy:plugins',
			'watch'
		]
	);
	grunt.registerTask( 
		'css', 
		[ 
			'clean:css', // clean target
			'copy:fonts', //copy fonts
			'sass:distTheme', // sass compilation
			'cssmin', // css minifications
			'clean:themecss', // cleanup combined css
			'rev:css', // create revision cache buster
			'clean:mincss', // clean min version
			'injector:css' // inject css location
		]
	);

	// Init grunt config
	grunt.initConfig({
		pkg : grunt.file.readJSON( 'package.json' ),
		/**
		* Directory watch tasks, which will force individual re-compilations
		**/
		watch : {

			recompile : {
				files : [ 'Gruntfile.js', 'bower.json', 'devincludes/plugins/**' ],
				tasks : [ 'default' ]	
			},

			sass : {
				files : [ 'devincludes/scss/*.{scss,sass}','devincludes/scss/**/*.{scss,sass}','devincludes/scss/**/**/*.{scss,sass}' ],
				tasks : [ 'sass:distTheme', 'cssmin', 'clean:themecss' ]
			},

            contentBoxJS : {
            	files : [ 'devincludes/js/contentbox/**/*.js' ],
            	tasks : [ 'uglify:contentboxJS' ]
            },

            vendorJS : {
            	files : [ 'devincludes/vendor/js/*.js' ],
            	tasks : [ 'copy:js', 'copy:plugins' ]
            },

            vendorCSS : {
            	files : [ 'devincludes/vendor/css/*.css' ],
            	tasks : [ 'sass:distTheme', 'cssmin', 'clean:themecss', 'copy:plugins' ]
            }
		},

		// SCSS Compilation to css
		sass : {
			options : {
				sourceMap : false
			},
			/**
			* Contentbox and Theme SCSS Compilation
			**/
			distTheme: {
			    files : {
					'../modules/contentbox-admin/includes/css/theme.css' : 'devincludes/scss/theme.scss'
				}
			 }
		},

		//uglification/copy of views and pages
		uglify : {

			/**
			* Compiled OSS Libraries
			**/
			libraries :{
				options :{
					preserveComments 	: true,
					mangle 				: false,
					banner 				: '/*! ContentBox Consolidated Open Source Javascript Libraries. Generated: <%= grunt.template.today("dd-mm-yyyy") %> */\n\n'
				},

				files : {

					//Libraries which are included in the HTML <head>
					'../modules/contentbox-admin/includes/js/preLib.js':
					[
				      	"bower_components/jquery/dist/jquery.min.js"
						,"bower_components/jquery.cookie/jquery.cookie.js"
						,"bower_components/jquery-validation/dist/jquery.validate.min.js"
						,"devincludes/vendor/js/jquery.validate.bootstrap.js"
						,"bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js"
						,"bower_components/moment/min/moment-with-locales.min.js"
						,"bower_components/lz-string/libs/lz-string.min.js"
						,"devincludes/vendor/js/modernizr.min.js"
						,"devincludes/js/app.js"
					],

					//Libraries which are brought in before the </body> end
					'../modules/contentbox-admin/includes/js/postLib.js':
					[
				      	"bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"
						,"bower_components/es6-shim/es6-shim.min.js"
				      	,"bower_components/navgoco/src/jquery.navgoco.min.js"
				      	,"bower_components/switchery/dist/switchery.min.js"
						,"bower_components/raphael/raphael-min.js"
						,"bower_components/morris.js/morris.min.js"
						,"bower_components/clockpicker/dist/bootstrap-clockpicker.min.js"
						,"devincludes/vendor/js/bootstrap-fileupload.js"
						,"bower_components/jwerty/jwerty.js"
						,"bower_components/datatables/media/js/jquery.dataTables.min.js"
						,"bower_components/datatables/media/js/dataTables.bootstrap.min.js"
						,"devincludes/vendor/js/jquery.uitablefilter.js"
						,"devincludes/vendor/js/jquery.uidivfilter.js"
						,"bower_components/TableDnD/dist/jquery.tablednd.min.js"
						,"bower_components/toastr/toastr.min.js"
						,"bower_components/Bootstrap-Confirmation/bootstrap-confirmation.js"
						,"bower_components/jquery-nestable/jquery.nestable.js"
					]
				}

			},
			/**
			* ContentBox Custom JS Compiliation
			**/
			contentboxJS : {
			 	options : {
				  	beautify 	: true,
				  	mangle 		: false,
				  	compress 	: false,
				    // the banner is inserted at the top of the output
				    banner 		: '/*! Copyright <%= grunt.template.today("yyyy") %> - Ortus Solutions (Compiled: <%= grunt.template.today("dd-mm-yyyy") %>) */\n'
			  	},
			  	files : [ {
					expand 	: true,
					cwd 	: 'devincludes/js',
					src 	: 'contentbox/**/*.js',
					dest 	: '../modules/contentbox-admin/includes/js/'
			    } ]
		    }
		},

		/**
		 * CSS Min
		 * Minifies the theme + bower + vendor css
		 */
		cssmin : {
			options : {
				sourceMap : true
			},
			target : {
				files : {
					'../modules/contentbox-admin/includes/css/contentbox.min.css' : [ 
						'../modules/contentbox-admin/includes/css/theme.css'
						// BOWER COMPONENTS
						,'bower_components/animate.css/animate.css'
						,'bower_components/switchery/dist/switchery.min.css'
						,'bower_components/morris.js/morris.css'
						// VENDORS
						,'devincludes/vendor/css/*.css'
						// PLUGINS
						,'devincludes/plugins/datatables/css/dataTables.bootstrap.css'
						,'devincludes/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css'
						,'devincludes/plugins/clockpicker/bootstrap-clockpicker.min.css'
					]
				}
			}
		},

		/**
		 * Cache Busting
		 */
		rev : {
			css : {
				files : { src : [ '../modules/contentbox-admin/includes/css/contentbox.min.css' ] }
			}
		}, // end cache busting

		/**
		 * HTML Injector for include locations
		 */
		injector : {
			options : {
				relative : false,
				transform : function( filepath, index, length ){
					if( filepath.indexOf( ".js" ) !== -1 ){
						return '<script src="#prc.cbroot#/includes/js/' + filepath.substr( filepath.lastIndexOf( '/' ) + 1 ) + '"></script>';
					}
					return '<link rel="stylesheet" href="#prc.cbroot#/includes/css/' + filepath.substr( filepath.lastIndexOf( '/' ) + 1 ) + '">';					
				}
			},
			css : {
				files : { 
					"../modules/contentbox-admin/layouts/inc/HTMLHead.cfm" : [ '../modules/contentbox-admin/includes/css/*contentbox.min.css' ]	
				}
			}
		},

		/**
		* Libraries with JS and/or CSS w/o SCSS support - migrated to their respective project plugin directories
		**/
		copy : {
			//Fonts to be copied over - will *replace* distribution fonts directory
		  	fonts : {
			  	files : [ 
			  		{ 
						expand 	: true, 
						flatten : true,
						src 	: 'bower_components/font-awesome-sass/assets/fonts/font-awesome/**',
						filter 	: 'isFile',
						dest 	: '../modules/contentbox-admin/includes/fonts/font-awesome'
					},
					{ 
						expand 	: true, 
						flatten : true,
						src 	: 'bower_components/bootstrap-sass/assets/fonts/bootstrap/**',
						filter 	: 'isFile',
						dest 	: '../modules/contentbox-admin/includes/fonts/bootstrap'
					}
			  	]
		  	},

			/**
			* Individual Javascript files migrated to project /includes/js 
			**/
			js : {
				// Single Javascript files to copy from bower
				files : [ 
				  	{
				  		expand 	: true,
				  		flatten : true,
				  		cwd 	: 'bower_components/',
				  		src 	: [ 
							"respond/dest/respond.min.js",
							"html5shiv/dist/html5shiv.min.js"
				  		],
				  		dest 	: '../modules/contentbox-admin/includes/js/'	
				  	},
				  	// Extra version of jQuery for CB FileBrowser
				  	{
				  		expand 	: true,
				  		flatten : true,
				  		cwd 	: 'bower_components/',
				  		src 	: [ 
							"jquery/dist/jquery.min.js"
				  		],
				  		dest 	: '../modules/contentbox-admin/includes/js/'	
				  	}
				]
			},

			/**
			* Compiled Plugins moved to /includes/plugins/
			* These are loaded not on every page but determined by certain conditions
			**/
			plugins : {
				files : [
					// Theme Required Plugins: Added a-la-carte
					{
						expand 	: true,
						cwd 	: 'devincludes/plugins/', 
						src 	: [
						'icheck/**',
						'mask/**'
						], 
						dest 	: '../modules/contentbox-admin/includes/plugins/',
					},
					// CKEditor
					{
						expand 	: true,
						cwd 	: 'bower_components/', 
						src 	: [
							'ckeditor/plugins/**',
							'ckeditor/adapters/**',
							'ckeditor/skins/moono/**',
							'ckeditor/lang/**',
							'ckeditor/ckeditor.js',
							'ckeditor/styles.js',
							'ckeditor/*.css',
						], 
						dest 	: '../modules/contentbox-admin/includes/plugins/',
					},
					//ContentBox CKEditor Config + Plugins
					{
						expand 	: true,
						cwd 	: 'devincludes/plugins/ckeditor/', 
						src 	: [
							'**'
						], 
						dest 	: '../modules/contentbox-admin/includes/plugins/ckeditor/',
					},
					//DataTables
					{
						expand 	: true,
						cwd 	: 'bower_components/datatables/media/', 
						src 	: [
							'**'
						], 
						dest 	: '../modules/contentbox-admin/includes/plugins/dataTables/'
					},
					//Bootstrap DatePicker
					{
						expand 	: true,
						cwd 	: 'bower_components/bootstrap-datepicker/dist/', 
						src 	: [
							'css/**',
							'js/**',
							'locales/**'
						], 
						dest 	: '../modules/contentbox-admin/includes/plugins/bootstrap-datepicker/'
					},
					//Bootstrap Clockpicker
					{
						expand 	: true,
						flatten : true,
						cwd 	: 'bower_components/clockpicker/dist/', 
						src 	: [
							'bootstrap-clockpicker.min.js',
							'bootstrap-clockpicker.min.css'
						], 
						dest 	: '../modules/contentbox-admin/includes/plugins/clockpicker/',
						filter 	: 'isFile'
					},
					//jQuery Star Rating
					{
						expand 	: true,
						flatten : true,
						cwd 	: 'bower_components/jquery-star-rating/min/', 
						src 	: [
							'rating.css',
							'rating.js'
						], 
						dest 	: '../modules/contentbox-admin/includes/plugins/jquery-star-rating/'
					}
				],
			}, // end plugins
		}, // end copy task

		/**
		* Directory Resets for Compiled Scripts - Clears the directories below in preparation for recompile
		* Only runs on on initial Grunt startup.  If removing plugins, you will need to restart Grunt
		**/
		clean : {
			options : {
		      force : true
		    },
		    targetIncludes : [ 
				'../modules/contentbox-admin/includes/plugins',
				'../modules/contentbox-admin/includes/fonts',
				'../modules/contentbox-admin/includes/css',
				'../modules/contentbox-admin/includes/js'
			],
			css 		: [ '../modules/contentbox-admin/includes/css' ],
			themecss	: [ "../modules/contentbox-admin/includes/css/theme.css" ],
			mincss 		: [ "../modules/contentbox-admin/includes/css/contentbox.min.css" ],
			revcss 		: [ "../modules/contentbox-admin/includes/css/*contentbox.min.css" ],
			js 			: [ '../modules/contentbox-admin/includes/js' ],
			plugins		: [ '../modules/contentbox-admin/includes/plugins' ]
		} 

	});

	// Load tasks
	// Load Tasks
	require( 'matchdep' )
		.filterDev( 'grunt-*' )
		.forEach( grunt.loadNpmTasks );
};