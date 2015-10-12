function banner()
{
    CocoonJS.Ad.onBannerReady.addEventListener(function() {

        CocoonJS.Ad.setBannerLayout(CocoonJS.Ad.BannerLayout.BOTTOM_CENTER);
        CocoonJS.Ad.showBanner();

    });
    // CocoonJS.Ad.showBanner()
    // alert('!')
}

CocoonJS.Ad.preloadBanner();
window.addEventListener("load",banner,false);
// banner();

var game;

//хаки:
//1. последний спрайт не грузится
//  загружаем пустой спрайт в конце
//2. шрифт отсутствует на начало работы
//  в разметке ставим символ, который его подтягивает

window.onload = function () {
    
    //удаляем символ исползующийся для хака со шрифтом 
    document.body.innerHTML = '';

    var width = window.innerWidth,
        height = window.innerHeight;

    // var width = navigator.isCocoonJS ? window.innerWidth : 480;
    // var height = navigator.isCocoonJS ? window.innerHeight : 320;

    // width = width * window.devicePixelRatio;
    // height = height * window.devicePixelRatio;

    game = new Phaser.Game(width, height, Phaser.CANVAS, 'laddercube', 
        {
            preload: function preload() {

                game.load.image('terra', 'assets/sprites/terra.png');

                game.load.image('pinkcube24', 'assets/sprites/pinkcube24.png');

                game.load.image('redwheel', 'assets/sprites/redwheel.png');

                game.load.image('carbase', 'assets/sprites/carbase.png');

                game.load.image('rect26x106', 'assets/sprites/rect26x106.png');
                game.load.image('tnt', 'assets/sprites/TNT.png');

                game.load.image('background','assets/sprites/debug-grid-1920x1920.png');

            },
            create: function create() {

                game.add.tileSprite(0, 0, 1920, 1920, 'background');

                game.world.setBounds(0, 0, 1920, 1920);

                game.physics.startSystem(Phaser.Physics.P2JS);
                game.physics.setBoundsToWorld();

                game.physics.p2.gravity.y = 1500;

                //  Make things a bit more bouncey
                game.physics.p2.restitution = 0.2;
                game.physics.p2.friction = 3;


                //установка фона
                /*
                {
                    var myBitmap = game.add.bitmapData(game.world.width, game.world.height);

                    var grd = myBitmap.context.createLinearGradient(0,0,0,game.world.height);
                    // grd.addColorStop(0, "#b0fbff");
                    // grd.addColorStop(1, "#ffbbf8");
                    grd.addColorStop(0, "#002255");
                    grd.addColorStop(1, "#000105");
                    myBitmap.context.fillStyle=grd;
                    myBitmap.context.fillRect(0,0,game.world.width,game.world.height);

                    game.add.sprite(0, 0, myBitmap);
                }
                */


                //подгружаем спрайты
                {
                    sprites.terra = game.add.sprite(game.world.width+500, game.world.height+500, 'terra');
                    sprites.terra.anchor.setTo(0.5, 0.5);
                    sprites.terra.scale.setTo(0.5, 0.5);

                    sprites.wheel = game.add.sprite(-500, -500, 'redwheel');
                    sprites.wheel.anchor.setTo(0.5, 0.5);
                    sprites.wheel.scale.setTo(0.5, 0.5);

                    sprites.wheel2 = game.add.sprite(-500, -500, 'redwheel');
                    sprites.wheel2.anchor.setTo(0.5, 0.5);
                    sprites.wheel2.scale.setTo(0.5, 0.5);

                    sprites.carbase = game.add.sprite(-500, -500, 'carbase');
                    sprites.carbase.anchor.setTo(0.5, 0.5);
                    sprites.carbase.scale.setTo(0.5, 0.5);

                    game.camera.follow(sprites.carbase);

                    sprites.stone = game.add.sprite(-500, -500, 'rect26x106');
                    sprites.stone.anchor.setTo(0.5, 0.5);
                    sprites.stone.scale.setTo(0.5, 0.5);

                    sprites.stone2 = game.add.sprite(-500, -500, 'rect26x106');
                    sprites.stone2.anchor.setTo(0.5, 0.5);
                    sprites.stone2.scale.setTo(0.5, 0.5);

                    sprites.stone3 = game.add.sprite(-500, -500, 'rect26x106');
                    sprites.stone3.anchor.setTo(0.5, 0.5);
                    sprites.stone3.scale.setTo(0.5, 0.5);

                    sprites.tnt = game.add.sprite(-500, -500, 'tnt');
                    sprites.tnt.anchor.setTo(0.5, 0.5);
                    sprites.tnt.scale.setTo(0.5, 0.5);
                }

                //предзагрузка текстов
                {
                }

                //хак от ошибки загрузки последнего спрайта
                game.add.sprite(0,0,'');


                controls.cursors = game.input.keyboard.createCursorKeys();

                //переходим к меню
                stages.change('lab');
            },
            update: function update() {


                    // console.log(!!player.sprites+':'+!controls.rotate.blocked)
                if(player.sprites && !controls.rotate.blocked)
                {
                    var pointer = (game.input.activePointer.isDown?game.input.activePointer:( (game.input.pointer1.isDown?game.input.pointer1:game.input.pointer2)) );

                    var anyrotatebutton = sprites.leftarrow||sprites.rightarrow;

                    var rotatebuttonsize = anyrotatebutton?anyrotatebutton.height*2:100;
                    // console.log(pointer.y+':'+(game.camera.view.y-rotatebuttonsize))
                    if (controls.cursors.left.isDown || (pointer.isDown && pointer.x < rotatebuttonsize && pointer.y > (game.camera.view.height-rotatebuttonsize) ) )
                    {
                    // console.log(game.camera)
                        
                        if(player.rotdir === 1 && (controls.rotate.lastpresstime === undefined || (new Date()-controls.rotate.lastpresstime) < 500))
                        {
                            player.rotspeed = player.rotspeed>player.maxrotspeed*1.5?player.maxrotspeed*1.5:player.rotspeed+10;
                        }
                        else
                        {
                            player.rotspeed = 0;
                        }

                        if(anyrotatebutton)
                        {
                            sprites.leftarrow.scale.setTo(0.6, 0.6);
                        }

                        controls.rotate.lastpresstime = new Date();

                        player.rotdir = 1;
                        player.sprites.wheel.body.rotateLeft(player.rotspeed);
                        player.sprites.wheel2.body.rotateLeft(player.rotspeed);

                        controls.tappedrotate = true;
                    }
                    else if (controls.cursors.right.isDown || (pointer.isDown && pointer.x > (game.camera.view.width-rotatebuttonsize) && pointer.y > (game.camera.view.height-rotatebuttonsize)))
                    {
                        // console.log((new Date()-controls.rotate.lastpresstime))
                        if(player.rotdir === 2 && (controls.rotate.lastpresstime === undefined || (new Date()-controls.rotate.lastpresstime) < 500))
                        {
                            player.rotspeed = player.rotspeed>player.maxrotspeed*1.5?player.maxrotspeed*1.5:player.rotspeed+10;
                        }
                        else
                        {
                            player.rotspeed = 0;
                        }
                        
                        if(anyrotatebutton)
                        {
                            sprites.rightarrow.scale.setTo(0.6, 0.6)
                        }

                        controls.rotate.lastpresstime = new Date();

                        player.rotdir = 2;

                        player.sprites.wheel.body.rotateRight(player.rotspeed);
                        player.sprites.wheel2.body.rotateRight(player.rotspeed);
                    }
                    else
                    {
                        controls.rotate.reset();
                    }
                }
            },
            render: function () {
                return;
                game.debug.cameraInfo(game.camera, 32, 32);

                var zone = game.camera.deadzone;

                if(zone)
                {
                    // console.log(zone)
                    game.context.fillStyle = 'rgba(255,0,0,0.6)';
                    game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
                }
                // game.debug.spriteCoords(sprites.tnt, 32, 32);
            }
        });
}


var texts = {
};

var sprites = {
}


var stages = {
    menu: function () {
    },
    resetoldstagef: [],
    clear: function () {

        var cleararlength = stages.resetoldstagef.length;
        if(cleararlength > 0)
        {
            var i;
            for(i = 0; i < cleararlength; i++)
            {
                stages.resetoldstagef[i]();
            }

            stages.resetoldstagef = [];
        }
    },
    change: function (stage) {
        if(stage !== stages.stage)
        {

            stages.clear();

            stages.stage = stage;

            if(stage === 'menu')
            {
            }
            else if(stage === 'score')
            {
                
            }
            else if(stage === 'lab')
            {

                var terra = sprites.terra;

                game.physics.p2.enable(terra, false);
                terra.body.kinematic = true;

                terra.body.x = game.world.centerX;
                terra.body.y = game.world.centerY-50;


                var stone = sprites.stone;
                game.physics.p2.enable(stone, false);
                stone.body.kinematic = true;

                stone.body.x = game.world.centerX+140;
                stone.body.y = game.world.centerY-32;

                var stone2 = sprites.stone2;
                game.physics.p2.enable(stone2, false);
                stone2.body.kinematic = true;

                stone2.body.x = game.world.centerX+120;
                stone2.body.y = game.world.centerY-35;

                var stone3 = sprites.stone3;
                game.physics.p2.enable(stone3, false);
                stone3.body.kinematic = true;

                stone3.body.x = game.world.centerX+100;
                stone3.body.y = game.world.centerY-32;

                var tnt = sprites.tnt;
                game.physics.p2.enable(tnt, false);

                // tnt.body.mass = 4.0;

                tnt.body.x = game.world.centerX;
                tnt.body.y = game.world.centerY-50-150;


                var carbase = player.sprites.carbase = sprites.carbase;
                game.physics.p2.enable(player.sprites.carbase, false);

                player.sprites.carbase.body.x = game.world.centerX;
                player.sprites.carbase.body.y = game.world.centerY-150;

                // game.camera.bounds.width = 100;
                // game.camera.bounds.height = 1000; 
                // console.log(game.camera)
                // game.camera.deadzone = new Phaser.Rectangle(100, 100, 200, 200);
                // var zone = game.camera.deadzone;
                // game.context.fillStyle = 'rgba(255,0,0,0.6)';
                // game.context.fillRect(zone.x, zone.y, zone.width, zone.height);
                // game.camera.deadzone = new Phaser.Rectangle(100,1000,1,1);
                // game.camera.focusOnXY(player.sprites.carbase.x, player.sprites.carbase.y)


                var wheel = player.sprites.wheel = sprites.wheel;
                game.physics.p2.enable(player.sprites.wheel, false);

                wheel.body.setCircle(7);

                player.sprites.wheel.body.x = game.world.centerX;
                player.sprites.wheel.body.y = game.world.centerY+10-150;

                var wheel2 = player.sprites.wheel2 = sprites.wheel2;
                game.physics.p2.enable(player.sprites.wheel2, false);

                wheel2.body.setCircle(7);

                player.sprites.wheel2.body.x = game.world.centerX;
                player.sprites.wheel2.body.y = game.world.centerY+10-150;

        

                var spring = game.physics.p2.createSpring(carbase,wheel, 70, 150, 50,null,null,[30,0],null);
                
                var spring_1 = game.physics.p2.createSpring(carbase,wheel2, 70, 150,50,null,null,[-30,0],null);
                    
                var constraint = game.physics.p2.createPrismaticConstraint(carbase,wheel, false,[30,0],[0,0],[0,1]);

                    constraint.lowerLimitEnabled=constraint.upperLimitEnabled = true;
                    constraint.upperLimit = -1;
                    constraint.lowerLimit = -8;    

                var constraint_1 = game.physics.p2.createPrismaticConstraint(carbase,wheel2, false,[-30,0],[0,0],[0,1]);

                    constraint_1.lowerLimitEnabled=constraint_1.upperLimitEnabled = true;
                    constraint_1.upperLimit = -1;
                    constraint_1.lowerLimit = -8;   

                


                controls.rotate.blocked = false;


            }
        }
    }
};

var controls = {
    cursors: null,
    rotate: {
        blocked: true,
        reset: function () {
            if(sprites.leftarrow && sprites.rightarrow && !controls.rotate.blocked)
            {
                sprites.leftarrow.scale.setTo(0.5, 0.5);
                sprites.rightarrow.scale.setTo(0.5, 0.5);
            }
        }
    }
}

var sounds = {
};

var player = {
    rotspeed:0,
    sprites: {

    }
};