// Define a global array to store scene objects
var grobjects = [];

grobjects.push(new GrassGround("Grass Ground"));

grobjects.push(new SpinningSphere("Teal Sphere",[4,1.5,0],0.1,[0,1,1]), "Y" );
grobjects.push(new SpinningSphere("Yellow Sphere",[-4,1.5,0],0.1,[1,1,0]), "Y" );
grobjects.push(new SpinningSphere("Green Sphere",[0,1.5,-4],0.1,[0.5,1.5,0]), "Y" );

grobjects.push(new SpinningDiamond("Blue Diamond", [4, 0.5, 4], 1, [0, 1, 2], 'Y'));
grobjects.push(new SpinningDiamond("Green Diamond", [-4, 0.5, 4], 1, [1, 2, 1], 'Y'));
grobjects.push(new SpinningDiamond("Purple Diamond", [4, 0.5, -4], 1, [4, 1, 5], 'Y'));
grobjects.push(new SpinningDiamond("Red Diamond", [-4, 0.5, -4], 1, [1, 0, 0], 'Y'));

grobjects.push(new Louvre("Lourve", [0, 0.1, 0], 4, [0, 1, 2], 'Y'));

grobjects.push(new Water("Body Water 1",[4.5,0.1,0],1,[.10,.10,.80]) );
grobjects.push(new Water("Body Water 1",[-4.5,0.1,0],1,[.10,.10,.80]) );

grobjects.push(new Skybox("Night Sky", [-1.3,10,-2],30,[1,1,1]) );

grobjects.push(new Building("Building 1", 2.0, [5.0, 1.0, -5.0], 1.0, [1,1,1], 4.0));
grobjects.push(new Building("Building 2", 2.0, [5.0, 1.0,  5.0], 1.0, [1,1,1], 3.0));
grobjects.push(new Building("Building 3", 2.0, [-5.0, 1.0, -5.0], 1.0, [1,1,1], 4.0));
grobjects.push(new Building("Building 4", 2.0, [-5.0, 1.0,  5.0], 1.0, [1,1,1], 3.0));

grobjects.push(new Obj("Purple Cylinder",[0,1, 4]), 0.25, [0,1, 1] );
