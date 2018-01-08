// Define a global array to store scene objects
var grobjects = grobjects || [];

grobjects.push(new GrassGround("grassGround1"));

grobjects.push(new SpinningDiamond("diamond1", [4, 0.5, 4], 1, [0, 1, 2], 'Y'));
grobjects.push(new SpinningDiamond("diamond2", [-4, 0.5, 4], 1, [1, 2, 1], 'Y'));
grobjects.push(new SpinningDiamond("diamond3", [4, 0.5, -4], 1, [4, 1, 5], 'Y'));
grobjects.push(new SpinningDiamond("diamond4", [-4, 0.5, -4], 1, [1, 0, 0], 'Y'));

grobjects.push(new Pyramid("pyramid1", [0, 0.1, 0], 4, [0, 1, 2], 'Y'));

grobjects.push(new SpinningSphere("spinSphere1",[4,1.5,0],0.1,[0,1,1]), "Y" );
grobjects.push(new SpinningSphere("spinSphere2",[-4,1.5,0],0.1,[1,1,0]), "Y" );
grobjects.push(new SpinningSphere("spinSphere3",[0,1.5,-4],0.1,[0.5,1.5,0]), "Y" );

grobjects.push(new OfficeBuilding("officeBuilding1", 2.0, [2.0, 1.0, -4.0], 1.0, [1,1,1], 4.0));
grobjects.push(new OfficeBuilding("officeBuilding2", 2.0, [2.0, 1.0,  4.0], 1.0, [1,1,1], 3.0));