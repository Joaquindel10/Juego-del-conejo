const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button;
var blower;
var bunny;
var blink,eat,sad;
var cut, eating, over, air, bg;

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  cut = loadSound("sound/cut.mp3");
  eating = loadSound("sound/eating_sound.mp3");
  over = loadSound("sound/sad.wav");
  air = loadSound("sound/air.wav");
  bg = loadSound("sound/sound1.mp3");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {
  createCanvas(500,700);
  frameRate(80);

  engine = Engine.create();
  world = engine.world;
  
  bg.setVolume(0.1);
  bg.play();
  button = createImg('cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);
  
  mute = createImg("sound/mute.png");
  mute.position(450,20);
  mute.size(50,50);
  mute.mouseClicked(silence);

  blower = createImg("blower.png");
  blower.position(10,280);
  blower.size(100,100);
  blower.mouseClicked(airblow);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  bunny = createSprite(400,620,60,60);
  bunny.scale = 0.2;
  bunny.debug = false
  bunny.setCollider("rectangle",0,0,60,60)

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  rope = new Rope(7,{x:245,y:30});
  ground = new Ground(200,690,600,20);
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  fruit_con = new Link(rope,fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,490,690);
  if(fruit!= null){
  image(food,fruit.position.x,fruit.position.y,70,70);
  
}

  rope.show();
  Engine.update(engine);
  ground.show();
  
  if(collide(fruit,bunny)==true){
    eating.play();
    bunny.changeAnimation("eating");
  }
  if(collide(fruit,ground.body)==true){
    bunny.changeAnimation("crying");
    bg.stop();
    over.play();
  }
   drawSprites();
}

function drop()
{
  cut.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null; 
}

function collide(body,sprite){
  if(body!= null){
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(d<=80){
      World.remove(engine.world,fruit);
      fruit = null;
      return true;
    }
    else{
      return false;
    }
  }
}
function silence(){
  if(bg.isPlaying()){
    bg.stop();
  }
  else{
    bg.play();
  }
}
function airblow(){
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0.01,y:0});
  air.play();
}