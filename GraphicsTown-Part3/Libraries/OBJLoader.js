/**
 *@author yusef sohail 
**/

var OBJLoader; 
(function(exports) {

	/**
	  * @desc 
	  * @param string 
	  * @param function 
	*/
	exports.load = function (url, cb) {

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			if(xmlhttp.readyState === 4 && xmlhttp.status === 200){
				cb(exports.parse(xmlhttp.responseText))
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	exports.loadAll = function (urls, cb) {
		var objs = [];
		var toLoad = urls.length;

		urls.forEach(function(url, index) {
			exports.load(url, function (obj) {
				objs[index] = obj;	
				if(--toLoad === 0) cb(objs); //all files loaded. 
			})
		})

		if(toLoad === 0 || toLoad === undefined){//nothing to load. 
			cb([]);
		}
	}

	var activeMaterial = null;

	exports.parse = function (str) {

		var lines = str.split("\n");

		activeMaterial = null;

		var out = {
			vertices : [],
			normals : [],
			texCoords : [],
			groups : {}
		};

		while(lines.length){
			lines = exports._parse(lines, out);
		}

		return out;

	}

	/**
	  * @desc internal function to help parsing of .obj files. Reads only one grouping. 
	  * @param array<string> lines - string to parse. IMPORTANT: lines must be the contents of a .obj file.
	  * @param object out - The object to add the so-far loaded object group. 
	*/
	exports._parse = function (lines, out) {

		var vertices = out.vertices,
			normals = out.normals,
			coords = out.texCoords,
			groups = out.groups;

		var faces = [];
		var name = null;

		var i = 0;

		mainloop:
		for(i = 0; i < lines.length;i++){//@TODO textureCoords + mateirals. + 4faced faces
			var tokens = lines[i].replace(/\s+/g, " ").split(" ")
			var t0 = tokens[0];
			switch(t0){
				case 'g':
					if(name === null){
						name = tokens[1];
					}else{
					//console.log("BREAKING!", tokens);
						break mainloop;
					}
					break;
				case "usemtl":
						activeMaterial = tokens[1];
					break;
				case 'v':
					vertices.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'vt':
					coords.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'vn':
					normals.push([ parseFloat(tokens[1]), parseFloat(tokens[2]), parseFloat(tokens[3]) ]);
					break;
				case 'f':
					var face =  [ tokens[1].split("/"),  tokens[2].split("/"), tokens[3].split("/") ]
					for(var n = 0; n < face.length;n++){
						var v = face[n];
						for(var j = 0; j < v.length;j++){
							var str = v[j];
							if(str.length){
								var value = parseInt(str);
								v[j] = (value >= 0)? value - 1 : vertices.length + value;
							}else{
								v[j] = null;
							}
						}

						for(var j = v.length; j < 3;j++){
							v[j] = null;
						}
					}
					faces.push(face);
					break;
			}


		}

		if(name !== null){
			groups[name] = {
				vertices : vertices,
				normals : normals,
				texCoords : coords,
				faces : faces,
				material : activeMaterial
			}
		}

		return lines.splice(i+1);
	}

	exports.createJSString = function (name, obj) {
		var str = "var LoadedOBJFiles = LoadedOBJFiles || {} ;\n";
		str += "LoadedOBJFiles[\"" + name + "\"]= {}\n";
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".vertices = " + JSON.stringify(obj.vertices) + "\n"
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".normals = " + JSON.stringify(obj.normals) + "\n"
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".texCoords = " + JSON.stringify(obj.texCoords) + "\n"
		str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups = {}\n"
		for(var key in obj.groups ){
			var keyStr = "'" + key + "'";
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ] = {}\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].vertices = " + "LoadedOBJFiles[\"" + name + "\"]" + ".vertices\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].normals = " + "LoadedOBJFiles[\"" + name + "\"]" + ".normals\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].texCoords = " + "LoadedOBJFiles[\"" + name + "\"]" + ".texCoords\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].faces = " + JSON.stringify(obj.groups[key].faces) + "\n"
			str += "LoadedOBJFiles[\"" + name + "\"]" + ".groups[" + keyStr + " ].material ='" + obj.groups[key].material + "'\n"

		}
		return str;
	}

})(OBJLoader = {})


var parseFaceShadedOBJ;

parseFaceShadedOBJ = function(str) {
  var fnorms, ftxcos, fverts, hasTextures, indices, j, k, l, len, len1, len2, len3, ln, m, matches, nindices, norms, o, objarr, ref, ref1, ref2, tindices, txcos, verts;
  objarr = str.split('\n');
  verts = [];
  norms = [];
  txcos = [];
  nindices = [];
  indices = [];
  tindices = [];
  hasTextures = void 0;
  for (j = 0, len = objarr.length; j < len; j++) {
    ln = objarr[j];
    if (ln.match(/v /)) {
      ref = ln.match(/v (.*) (.*) (.*)/).slice(1);
      for (k = 0, len1 = ref.length; k < len1; k++) {
        m = ref[k];
        verts.push(Number(m));
      }
    }
    if (ln.match(/vn /)) {
      ref1 = ln.match(/vn (.*) (.*) (.*)/).slice(1);
      for (l = 0, len2 = ref1.length; l < len2; l++) {
        m = ref1[l];
        norms.push(Number(m));
      }
    }
    if (ln.match(/vt /)) {
      ref2 = ln.match(/vt (\d?.?\d+) (\d?.?\d+)$/).slice(1);
      for (o = 0, len3 = ref2.length; o < len3; o++) {
        m = ref2[o];
        txcos.push(Number(m));
      }
    }
    if (ln.match(/f /)) {
      matches = ln.match(/\ (\d+)\//g);
      indices = indices.concat(matches.map(function(i) {
        return Number(i.slice(1, -1) - 1);
      }));
      matches = (ln.match(/\/(\d+)\//g)) || [];
      tindices = tindices.concat(matches.map(function(i) {
        return Number(i.slice(1, -1) - 1);
      }));
      matches = (ln.match(/\/(\d+)(\ |$)/g)) || [];
      nindices = nindices.concat(matches.map(function(i) {
        return Number(i.slice(1) - 1);
      }));
    }
  }
  fnorms = [];
  nindices.forEach(function(n) {
    return fnorms = fnorms.concat([norms[n * 3], norms[n * 3 + 1], norms[n * 3 + 2]]);
  });
  fverts = [];
  indices.forEach(function(i) {
    return fverts = fverts.concat([verts[i * 3], verts[i * 3 + 1], verts[i * 3 + 2]]);
  });
  ftxcos = [];
  tindices.forEach(function(i) {
    return ftxcos = ftxcos.concat([txcos[i * 2], txcos[i * 2 + 1]]);
  });
  return {
    verts: fverts,
    norms: fnorms,
    txtcos: ftxcos
  };
};

