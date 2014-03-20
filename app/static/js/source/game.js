(function(){

  'use strict';

  var drawingCanvas;
  var context;
  var smartMap = [];
  var player;

  $(document).ready(initialize);

  function initialize(){
    prepCanvas();
    generateMap(1);
    startGame();
    $('body').keydown(keyDown);
    $('body').keyup(keyUp);
  }

/*---Map Prep Functions---*/
  function prepCanvas(){
    drawingCanvas = document.getElementById('game');
    if(drawingCanvas.getContext){
      context = drawingCanvas.getContext('2d');
    }
  }

  function generateMap(level){
    var map = [];
    var trapoptions, treasureoptions = [];
    if(level===1){
      trapoptions = ['gt','gt','gt','gt','gt','gt','gt','gt','bt','bt'];
      treasureoptions = ['tc','tc','tc','tc','tc','tc','ts','ts','ts','tg'];
    }
    else if(level===2){
      trapoptions = ['gt','gt','gt','gt','gt','bt','bt','bt','bt','bt'];
      treasureoptions = ['tc','tc','tc','tc','ts','ts','ts','ts','tg','tg'];
    }
    else if(level===3){
      trapoptions = ['gt','gt','bt','bt','bt','bt','bt','bt','bt','bt'];
      treasureoptions = ['tt','tc','ts','ts','ts','ts','ts','tg','tg','tg'];
    }
    else if(level===4){
      trapoptions = ['gt','gt','bt','bt','bt','bt','bt','bt','rt','rt'];
      treasureoptions = ['tt','ts','ts','ts','tg','tg','tg','tg','ta','ta'];
    }
    else if(level===5){
      trapoptions = ['gt','gt','bt','bt','bt','bt','rt','rt','rt','rt'];
      treasureoptions = ['tt','tt','tg','tg','tg','tg','ta','ta','tr','tr'];
    }
    for(var i=0; i<10; i++){
      var row = [];
      if(i===0){
        row = ['..','..','..','..','..','..','..','..','..','pp'];
      }else if (i===9){
        row = ['pp','..','..','..','..','..','..','..','..','..'];
      }
      else{
        row.push('..');
        for(var j=0; j<8; j++){
          var p = random(64);
          if(p<21){
            row.push('..');
          }else if(p>20 && p<41){
            row.push('ww');
          }else if(p>40 && p<57){
            row.push(_.sample(trapoptions));
          }else if(p>56){
            row.push(_.sample(treasureoptions));
          }
        }
        row.push('..');
      }
      map.push(row);
    }

    _.forEach(map, function(row){
      var line = '';
      _.forEach(row, function(e){
        line += e;
      });
      console.log(line);
    });

    parseMap(map);
  }

  function parseMap(map){
    smartMap = [];
    var rowCount = 0;
    var colCount = 0;
    _.forEach(map, function(row){
      var newRow = _.map(row, function(type){
        var m1 = new MapObject(type, colCount, rowCount);
        colCount++;
        if(colCount===10){
          colCount = 0;
        }
        return m1;
      });
      smartMap.push(newRow);
      rowCount++;
    });
    console.log(smartMap);
    drawMap(smartMap);
  }

/*---Animation Functions---*/
  function drawMap(map){
    _.forEach(map, function(row){
      _.forEach(row, function(mapObject){
        context.drawImage(mapObject.sprite, mapObject.x, mapObject.y);
      });
    });
  }

  function startGame(){
    player = new Player();
    if (window.requestAnimationFrame !== undefined){
      window.requestAnimationFrame(animate);
    }
  }

  function animate(){
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawMap(smartMap);
    context.drawImage(player.sprite, player.x, player.y);
    testCollision();
    player.x += player.xvelocity;
    player.y += player.yvelocity;
    if(window.requestAnimationFrame !== undefined){
      window.requestAnimationFrame(animate);
    }
  }

  function testCollision(){
    var currentCol = Math.floor(player.x/65);
    var currentRow = Math.floor(player.y/65);
    //console.log(currentCol, currentRow);
    /*---Tests Against Boundaries of the Canvas---*/
    if(player.x===0 && player.xvelocity < 0){ //left wall
      player.xvelocity = 0;
    }
    if(player.x+player.width===650 && player.xvelocity > 0){ //right wall
      player.xvelocity = 0;
    }
    if(player.y===0 && player.yvelocity < 0){ //top wall
      player.yvelocity = 0;
    }
    if(player.y+player.height===650 && player.yvelocity > 0){ //bottom wall
      player.yvelocity = 0;
    }

    var testArray = [];
    testArray.push(smartMap[currentRow][currentCol]);
    if(currentRow > 0){
      testArray.push(smartMap[currentRow-1][currentCol]);
      if(currentCol > 0){
        testArray.push(smartMap[currentRow-1][currentCol-1]);
      }
      if(currentCol < 9){
        testArray.push(smartMap[currentRow-1][currentCol+1]);
      }
    }
    if(currentRow < 9){
      testArray.push(smartMap[currentRow+1][currentCol]);
      if(currentCol > 0){
        testArray.push(smartMap[currentRow+1][currentCol-1]);
      }
      if(currentCol < 9){
        testArray.push(smartMap[currentRow+1][currentCol+1]);
      }
    }
    if(currentCol > 0){
      testArray.push(smartMap[currentRow][currentCol-1]);
    }
    if(currentCol < 9){
      testArray.push(smartMap[currentRow][currentCol+1]);
    }
    //console.log(testArray);
    _.forEach(testArray, function(square){
      if(square.type==='ww'){
        if(player.x===square.x+square.width && player.y<square.y+square.height && player.y+player.height>square.y && player.xvelocity < 0){ //moving left into a wall
          player.xvelocity = 0;
        }
        if(player.x+player.width===square.x && player.y<square.y+square.height && player.y+player.height>square.y && player.xvelocity > 0){ //moving right into a wall
          player.xvelocity = 0;
        }
        if(player.y===square.y+square.height && player.x<square.x+square.width && player.x+player.width>square.x && player.yvelocity < 0){ //moving up into a wall
          player.yvelocity = 0;
        }
        if(player.y+player.height===square.y && player.x<square.x+square.width && player.x+player.width>square.x && player.yvelocity > 0){ //moving down into a wall
          player.yvelocity = 0;
        }
      }
    });
  }

/*---Keypress Functions---*/
  function keyDown(e){
    if(e.which===37){           //left arrow
      player.xvelocity = -1;
      player.sprite.src = '/img/avatars/lockeleft.gif';
    }else if(e.which===38){     //up arrow
      player.yvelocity = -1;
      player.sprite.src = '/img/avatars/lockeback.gif';
    }else if(e.which===39){     //right arrow
      player.xvelocity = 1;
    }else if(e.which===40){     //down arrow
      player.yvelocity = 1;
      player.sprite.src = '/img/avatars/locke.gif';
    }else if(e.which===84){     //t key for trap disarming
      player.xvelocity = 0;
      player.yvelocity = 0;
      player.sprite.src = '/img/avatars/lockekneel.gif';
      var currentRow = Math.floor((player.y+player.height)/65);
      var currentCol = Math.floor(player.x/65);
      console.log(currentRow + ', ' + currentCol);
      if(smartMap[currentRow][currentCol].type.slice(0,1)==='t'){
        alert('Treasure obtained!');
      }
    }
  }

  function keyUp(e){
    player.xvelocity = 0;
    player.yvelocity = 0;
  }

/*---Object Models---*/
  function MapObject(type, col, row){
    this.sprite = new Image();
    this.sprite.src = getPicSource(type);
    this.type = type;
    this.x = col * 65;
    this.y = row * 65;
    this.width = 65;
    this.height = 65;
  }

  function Player(){
    this.sprite = new Image();
    this.sprite.src = '/img/avatars/locke.gif';
    this.x = 16;
    this.y = 593;
    this.xvelocity = 0;
    this.yvelocity = 0;
    this.width = 32;
    this.height = 48;
  }

/*---Helper Functions---*/
  function getPicSource(object){
    if(object==='tc'||object==='ts'||object==='tg'||object==='ta'||object==='tr'||object==='tt'){
      return '/img/objects/treasure2.png';
    }else if(object==='gt'||object==='bt'||object==='rt'||object==='..'){
      return '/img/objects/transparent.png';
    }else if(object==='ww'){
      return '/img/objects/wall3.png';
    }else if(object==='pp'){
      return '/img/objects/portal.gif';
    }
  }

  function random(max){
    var r = Math.floor((Math.random()*max)+1);
    return r;
  }
})();
