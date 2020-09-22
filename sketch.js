var dog, happyDog, dogImg, happyDogImg, database, foodS, foodStock;

var fedTime,lastFed;
var feed,addFood;
var foodobj;

function preload() {

  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happydog.png");
}

function setup() {
  createCanvas(1000, 400);
  
  dog = createSprite(250,300,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();
  foodStock = database.ref("food");
  foodStock.on("value", readStock);

  foodobj = new Food();

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}


function draw() {  
  background(46, 139, 87);

  foodobj.display();



  fedTime = database.ref("feedtime");
  fedTime.on("value",function(data) {
    lastFed = data.val() ;
  })

  fill(255);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + "PM", 350,30);
  }
  else if(lastFed===0){
    text("Last Fed : 12 AM", 350,30);
  }
  else {
    text("Last Fed : "+ lastFed + "AM", 350,30);
  }

  drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodobj.updateFoodStock(foodS);
}


function feedDog() {
  dog.addImage(happyDogImg);

  foodobj.updateFoodStock(foodobj.getFoodStock()-1);
  database.ref("/").update({
    food:foodobj.getFoodStock(),
    feedtime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    food:foodS
  })
}