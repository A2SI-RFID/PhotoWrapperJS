var photoWrapper = {
    version: 1.0,
    photoWrapper: function (elt, width, height, afterInit, onImportPhoto) {
	/** BEGIN VAR **/
	var _this = this;
	var constraints = {
	    audio: false,
	    video: {
		optional: [{
			sourceId: null
		    }]
	    }
	};
	var video = null;
	var videoPlaying = false;
	var media = null;
	var width = width;
	var height = height;
	var stream = null;
	var sources = [];
	var currentSourceIndex = 0;
	var elt = elt;
	var input = null;
	var nbRessources = 0;
	/** END VAR **/

	/** BEGIN PRIVATE METHOD **/
	/**
	 * Call the after init callback
	 * @returns {undefined}
	 */
	var callCallback = function () {
	    nbRessources++;
	    // only if the 3 ressources loaded
	    if (nbRessources === 3 && typeof afterInit === "function") {
		// call the callback
		afterInit.call(_this);
		// reset the number of ressources
		nbRessources = 1;
	    }
	};

	/**
	 * Call the callback after import file
	 * @param {string} dataUrl
	 * @returns {undefined}
	 */
	var callCallbackImportFile = function (dataUrl) {
	    // only if the var is a function
	    if (typeof onImportPhoto === "function") {
		onImportPhoto.call(_this, dataUrl);
	    }
	};

	/**
	 * Load image after changing input file
	 * @returns {undefined}
	 */
	var loadImg = function () {
	    // return if no file
	    if (input.files.length === 0) {
		return;
	    }

	    // declare vars
	    var file = input.files[0];
	    var reader = new FileReader();
	    var allowedTypes = ['png', 'jpg', 'jpeg'];

	    // get img type
	    var imgType = file.name.split('.');
	    imgType = imgType[imgType.length - 1].toLowerCase();

	    // verify img type or return
	    if (allowedTypes.indexOf(imgType) === -1) {
		return;
	    }

	    // add callback on reader load
	    reader.addEventListener('load', function () {
		callCallbackImportFile(this.result);
	    });

	    // start reader
	    reader.readAsDataURL(file);
	};

	/**
	 * Return true if we can access the user media
	 * @returns {Boolean}
	 */
	var hasAccessToMedia = function () {
	    return (navigator.getUserMedia !== null);
	};

	/**
	 * Init trak sources and return the userMedia
	 * @returns {Navigator.msGetUserMedia|navigator.msGetUserMedia|Navigator.getUserMedianavigator.getUserMedia|navigator.getUserMedianavigator.getUserMedia|navigator.mozGetUserMedia|Navigator.mozGetUserMedia|Navigator.webkitGetUserMedia|navigator.webkitGetUserMedia}
	 */
	var initUserMedia = function () {
	    // callback function for tracks getter
	    var trackGetter = function (sourceInfos) {
		for (var i = 0; i !== sourceInfos.length; ++i) {
		    var sourceInfo = sourceInfos[i];
		    if (sourceInfo.kind === 'video' || sourceInfo.kind === 'videoinput') {
			sources.push(sourceInfo.id || sourceInfo.deviceId);
		    }
		}
		// call the after init callback
		callCallback();
	    };

	    // polyfill
	    if (typeof navigator.mediaDevices !== 'undefined' && typeof navigator.mediaDevices.enumerateDevices === "function") {
		navigator.mediaDevices.enumerateDevices().then(trackGetter);
	    } else if (typeof MediaStreamTrack !== 'undefined' && typeof MediaStreamTrack.getSources === 'function') {
		trackGetter = MediaStreamTrack.getSources(trackGetter);
	    } else {
		// call the callback if no access to those trackGetter
		callCallback();
	    }

	    // user medias polyfill
	    return navigator.getUserMedia = navigator.getUserMedia ||
		    navigator.webkitGetUserMedia ||
		    navigator.mozGetUserMedia ||
		    navigator.msGetUserMedia || null;
	};

	/**
	 * Start the camera
	 * @returns {undefined}
	 */
	var start = function () {
	    // verify access to user media
	    if (!hasAccessToMedia()) {
		// call after init callback
		callCallback();
		return;
	    }

	    // stop the stream if it already exists
	    if (stream) {
		stop();
	    }

	    // set source id in the constraint var
	    constraints.video.optional[0].sourceId = sources[currentSourceIndex];

	    // get the media
	    media = navigator.getUserMedia(constraints, function (istream) {
		stream = istream;
		// URL Object is different in WebKit
		var url = window.URL || window.webkitURL;
		// create the url and set the source of the video element
		video.src = url ? url.createObjectURL(istream) : istream;
		// Start the video
		videoPlaying = true;
		// call after init callback
		callCallback();
	    }, function () {
		// in case of error, only call after init callback
		callCallback();
	    });
	};

	/**
	 * Stop the camera
	 * @returns {undefined}
	 */
	var stop = function () {
	    // if the video is not playing => nothing to do
	    if (!videoPlaying) {
		return;
	    }
	    // get tracks
	    var tracks = stream.getTracks();
	    // if we have a track we stop it
	    if (tracks[0]) {
		tracks[0].stop();
		videoPlaying = false;
	    }
	};
	/** END PRIVATE METHOD **/


	/** BEGIN INIT **/
	// create video DOM element
	video = document.createElement('video');
	video.autoplay = true;
	video.classList.add('photoAPI');
	elt.appendChild(video);
	// create input DOM element
	input = document.createElement('input');
	input.type = "file";
	input.accept = "image/*;capture=camera";
	input.style = "display:none;";
	input.classList.add('photoAPI_input');
	elt.appendChild(input);
	// binding
	input.addEventListener('change', loadImg);
	// init
	initUserMedia();
	start();
	/** END INIT **/


	/** BEGIN METHOD **/
	/**
	 * Return the video DOM Element
	 * @returns {photoAPI.photoAPI.video}
	 */
	this.getVideo = function () {
	    return video;
	};

	/**
	 * Trigger the input file click
	 * @returns {undefined}
	 */
	this.triggerInputFileClick = function () {
	    input.dispatchEvent(new MouseEvent('click', {
		'view': window,
		'bubbles': true,
		'cancelable': true
	    }));
	};
	/**
	 * Start the camera
	 * @returns {undefined}
	 */
	this.start = function () {
	    start();
	};
	/**
	 * stop the camera
	 * @returns {undefined}
	 */
	this.stop = function () {
	    stop();
	};

	/**
	 * Return true if you can access the media and get photo via camera
	 * @returns {Boolean}
	 */
	this.hasAccessToMedia = function () {
	    return (hasAccessToMedia() && stream !== null);
	};

	/*
	 * Return the photo as a dataUrl
	 * @returns {photoAPI.photoAPI.video}
	 */
	this.getPhoto = function () {
	    // create the temporary canvas
	    var tmp = document.createElement("canvas");
	    // set size
	    tmp.width = width;
	    tmp.height = height;

	    // calc img size
	    var scale = (((video.clientWidth * (height / video.clientHeight)) > width) ? (width / video.clientWidth) : (height / video.clientHeight));
	    var dx = (width - (video.clientWidth * scale)) / 2;
	    var dy = (height - (video.clientHeight * scale)) / 2;
	    var dw = (video.clientWidth * scale);
	    var dh = (video.clientHeight * scale);

	    // draw image in canvas
	    tmp.getContext('2d').drawImage(video, dx, dy, dw, dh);

	    // return the photo dataUrl
	    return tmp.toDataURL();
	};

	/**
	 * Switch to the next camera source if it exists
	 * @returns {undefined}
	 */
	this.switchSource = function () {
	    if (sources.length < 2) {
		return;
	    }
	    currentSourceIndex = (currentSourceIndex + 1) % sources.length;
	    start();
	};

	/**
	 * Return true if you can switch between camera sources
	 * @returns {Boolean}
	 */
	this.canSwitchSources = function () {
	    return (sources.length >= 2);
	};

	/**
	 * Return video stream
	 * @returns {istream|photoAPI.photoAPI.stream}
	 */
	this.getStream = function () {
	    return stream;
	};
	/** END METHOD **/

	// call afterInit callback
	callCallback();
    }
};
