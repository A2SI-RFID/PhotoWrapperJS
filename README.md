# PhotoWrapperJS
JS Wrapper to allow taking photo with the HTML media API. It can be used on desktop, tablet or smartphone.
On IOs devices, it uses an hidden input file with accept tag so that propose to use the camera.

### Requirement

If you want to use it on production you will have to access the website under the HTTPS protocol. Otherwise, most navigators block the access to the userMedia

### How to use

- import photoWrapper.js in the file you need it
- create a new instance of the plugin calling ```new photoWrapper.photoWrapper(elt,width,height,afterInit,onImportPhoto);```
- store the instance to be able to call plugin's methods

### Callbacks

* ```afterInit()``` is a callback called after the plugin's initialization
* ```onImportPhoto(dataUrl)``` is a callback called after the user imported a photo thanks to the input file, the plugin use the HTML5 File API to load the image without sending it to a server but directly in the DOM. So you can access the image as a dataUrl with the var ```dataUrl```


### Methods

- ```start()``` : start the camera to be able to take a photo
- ```stop()``` : stop the camera (if you don't need it anymore)
- ```getPhoto()``` : return the photo as a dataUrl
- ```getVideo()``` : return the videoElement used to display the camera preview
- ```triggerInputFileClick()``` : trigger the input file click to allow user to import a photo
- ```hasAccessToMedia()``` : return true if the plugin can access userMedia and use cameras
- ```canSwitchSources()``` : return true if there is more than one source for the camera (for example: front and back for a smartphone)
- ```switchSource()``` :  switch to the next source if there are more than one source
- ```getStream()``` : return the camera stream


### Examples

Examples are availables in the *examples* directory

### Requests

Feel free to ask for request or to do pull request if you think you've improved the plugin

## License  
This piece of software is issued under the GNU GENERAL PUBLIC LICENSE. You can view the license [here](https://github.com/A2SI-RFID/PhotoWrapperJS/blob/master/LICENSE)
