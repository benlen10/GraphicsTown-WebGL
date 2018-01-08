# CS559 GraphicsTown (Part III)

### **Author:** Benjamin Lenington (lenington@wisc.edu) (Fall 2017)

### **Description:**  Implement various objects, movement and custom shaders within the WebGL Framework

### **Features:**
-	Custom UI that supports varying object speed, isolating specific objects and other features

-	Custom obj loader (Based upon Yusef Sohail’s [source](http://graphics.cs.wisc.edu/WP/cs559-fall2016/2016/11/11/image-base64-encoding-plus-obj-model-loaders/)) to convert obj strings into JavaScript

- Modify arcball functionality to support a dynamically changing canvas location

- Create and import a custom 3D [object](Objects/obj_src/cylinder_obj_src.js) using blender

- Texture loading from static Flickr [album](https://www.flickr.com/gp/160869673@N02/GX0277).  See full URL [list](Textures/TEXTURE-STATIC-URLS.MD)

- Implement specular and diffuse lighting for certain objects

- Design a custom grass texture using Paint.NET 4.0 and [distortion effects](Textures/TEXTURE-README.MD)

- Custom skybox and night sky shader

- Implement object movement with variable speed

- External style.css file to customize elements and interface appearance 

- Implement advanced shaders including bump mapping for the two bodies of water. The bump map texture of the water is easier to examine in driving or flying view mode

- Create a [scene loader](sceneLoader.js) centralize the loading process for all objects

- Restructure source code directories for improved clarity and organization
