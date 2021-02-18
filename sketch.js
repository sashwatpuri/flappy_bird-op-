var flappy ,flappyImage , flappystop ;
var pipe , pipe1a , pipe1b , pipe2a , pipe2b , pipe3a , pipe3b , pipe4a , pipe4b , pipe5a , pipe5b ; 
var bg , startbg ; 
var ground ; 
var GameState = 0 ;
var title , playButton ,play ; 
var getready ; 
var pipegroup  ;
var score = 0 ;
var GameOverI , GameOver ; 
var bgMusic , dieMusic , PointsMusic ; 
var playMusic = 1 ; 
var restart , restartimg ; 

function preload(){
     bg = loadImage('Images/bg.png');
     startbg = loadImage('Images/startbg.png');
     title = loadImage('Images/title.png');
     playButton = loadImage('Images/PLAY_BUTTON.png');
     flappyImage = loadAnimation('Images/flappy1.png','Images/flappy2.png','Images/flappy3.png','Images/flappy4.png');
     flappystop = loadAnimation('Images/flappy4.png');
     pipe1a = loadImage('Images/pipe1a.png');
     pipe1b = loadImage('Images/pipe1b.png');
     pipe2a = loadImage('Images/pipe2a.png');
     pipe2b = loadImage('Images/pipe2b.png');
     pipe3a  = loadImage('Images/pipe3a.png');
     pipe3b = loadImage('Images/pipe3b.png');
     pipe4a = loadImage('Images/pipe4a.png');
     pipe4b = loadImage('Images/pipe4b.png');
     pipe5a = loadImage('Images/pipe5a.png');
     pipe5b  = loadImage('Images/pipe5b.png');
     GameOverI = loadImage("Images/Game_Over.png");

     restartimg = loadImage('Images/restartimg.png');

    getready = loadImage('Images/getready.png');

    bgMusic = loadSound('Sounds/Background.mp3');
    dieMusic = loadSound('Sounds/die.mp3');
    PointsMusic = loadSound('Sounds/points.mp3');

    }

function setup(){
    createCanvas(displayWidth - 50 ,displayHeight - 200);

    ground = createSprite(width,height/2,2*width,height);
    ground.addImage(bg);
    ground.visible = false ; 

    play = createSprite(width/2,height-200);
    play.visible = false ; 

    flappy = createSprite(200,height/2);
    flappy.visible = false ; 
    flappy.addAnimation("running",flappyImage);
    flappy.addAnimation("stop",flappystop);
    flappy.scale = 0.35 ; 
    flappy.setCollider("rectangle",0,0,100,100) ;

    pipegroup = new Group();

    GameOver = createSprite(width/2,height/2-60);
    GameOver.addImage(GameOverI);
    GameOver.visible = false ; 

    restart = createSprite(width/2,height/2 + 100);
    restart.addImage(restartimg);
    restart.visible = false ; 
    
   
    



}

function draw (){ 

    if(GameState == 0 ){
        background(startbg);
        imageMode(CENTER);
        image(title,width/2,125,500,100);

        image(getready,width/2,height/2,500,100);


        play.visible = true ; 
        play.addImage(playButton);
        play.scale = 2 ;  

        if(mousePressedOver(play)){
             GameState = 1 ; 
             play.visible = false ; 
             getready.visible = false ; 
        }
        
    }

    else if(GameState == 1 ){
        background("white");
        ground.visible = true ; 
        ground.velocityX = -3 ; 
        if(playMusic == 1){
        bgMusic.loop();
        playMusic = 0 ; 
        
        }
        var edges = createEdgeSprites();
        flappy.collide(edges);


        if(ground.x < 0){
            ground.x = ground.width/2 ; 
        }

        flappy.visible = true ; 

        if(mousePressedOver(ground)){
            flappy.velocityY = -5 ; 
        }
        flappy.velocityY -= -0.5

        pipes();
    
        score = score + Math.round(getFrameRate()/60);
        if(score % 200 == 0 && score > 0  ){
            PointsMusic.play();
        }

        if(pipegroup.isTouching(flappy)){
            GameState = 2
            dieMusic.play();
            bgMusic.stop();
        }
    }

    else if(GameState == 2){
        background('white');
        ground.velocityX = 0 ; 
        flappy.velocityY = 0 ;
        pipegroup.setVelocityXEach(0);
        pipegroup.setLifetimeEach(-1);
        GameOver.visible = true ;
        GameOver.scale = 1.5 ; 
        flappy.changeAnimation("stop");
        restart.visible = true ; 

        if(mousePressedOver(restart)){
            GameState = 1 ; 
            GameOver.visible = false ; 
            restart.visible = false ;
            pipegroup.destroyEach();
            flappy.changeAnimation("running"); 
            score = 0 ; 
            playMusic = 1 ; 
        }
    }

    drawSprites();
    if(GameState == 1 || GameState == 2){
    textSize(32);
    fill("black");
    textFont("Arabian");
    text("Score : "+score,100,50);
    }
}

function pipes(){
    if(frameCount % 100 == 0){
        var pipeA = createSprite(width,height/4);
        var pipeB = createSprite(width,height-100);
        var choose = Math.round(random(1,5));
        

        switch(choose){
            case 1 :pipeA.y = height-494 ;pipeB.y = height- 120 ; 
             pipeA.addImage(pipe1a);
             pipeB.addImage(pipe1b);
            break ; 

            case 2 :pipeA.y = height-474 ;pipeB.y = height- 40 ; 
                pipeA.addImage(pipe2a);
            pipeB.addImage(pipe2b);
            break;

            case 3 :pipeA.y = height-624 ;pipeB.y = height-190 ; 
                pipeA.addImage(pipe3a);
            pipeB.addImage(pipe3b);
            break ; 

            case 4 :pipeA.y = height-449 ;pipeB.y = height-70 ; 
                pipeA.addImage(pipe4a);
            pipeB.addImage(pipe4b);
            break;

            case 5 :pipeA.y = height-624 ;pipeB.y = height - 215 ; 
                pipeA.addImage(pipe5a);
            pipeB.addImage(pipe5b);
            break;
        }

        pipeA.velocityX = -3 ; 
        pipeA.lifetime = Math.round(width/3);
        pipeA.scale = 1.1 ;  
        pipeB.velocityX = -3 ; 
        pipeB.lifetime = Math.round(width/3);
        pipeB.scale = 1.1 ; 

        pipegroup.add(pipeA);
        pipegroup.add(pipeB);
        GameOver.depth = pipeA.depth+1 ;
        GameOver.depth = pipeB.depth+1 ; 
        restart.depth = pipeA.depth+1 ;
        restart.depth = pipeB.depth+1 ;
    }
}
