const canvas = document.querySelector('canvas');


canvas.width =  1024; // innerWidth
canvas.height = 576; // innerHeight

const c = canvas.getContext('2d');
const gravity = 0.5;


const MAX_RIGHT_POSITION_BEFORE_SCROLL = 400;
const MIN_RIGHT_POSITION_BEFORE_SCROLL = 100;


let scrollOffset = 0; // how much the player has moved

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

const baseUrl = "https://raw.githubusercontent.com/Ryan-R-C/Plataformer-js-game/main/assets";

const backgroundUrl = `${baseUrl}/background.png`;
const hillsUrl = `${baseUrl}/hills.png`;
const platformUrl = `${baseUrl}/platform.png`;
const platformSmallTallUrl = `${baseUrl}/platformSmallTall.png`;
const spriteRunLeftUrl = `${baseUrl}/spriteRunLeft.png`;
const spriteRunRightUrl = `${baseUrl}/spriteRunRight.png`;
const spriteStandLeftUrl = `${baseUrl}/spriteStandLeft.png`;
const spriteStandRightUrl = `${baseUrl}/spriteStandRight.png`;


const backgroundImage = new Image();
backgroundImage.src = backgroundUrl;

const hillsImage = new Image();
hillsImage.src = hillsUrl;

const platformImage = new Image();
platformImage.src = platformUrl;

const platformSmallTallImage = new Image();
platformSmallTallImage.src = platformSmallTallUrl;

const spriteRunLeftImage = new Image();
spriteRunLeftImage.src = spriteRunLeftUrl;

const spriteRunRightImage = new Image();
spriteRunRightImage.src = spriteRunRightUrl;

const spriteStandLeftImage = new Image();
spriteStandLeftImage.src = spriteStandLeftUrl;

const spriteStandRightImage = new Image();
spriteStandRightImage.src = spriteStandRightUrl;


const FLOOR_PLATFORM_Y = (image) => canvas.height - image.height;
const FLOOR_PLATFORM_X = (image) => image.width - 2;

const END_OF_LEVEL = 4310;


const keys = {
    up: {
        pressed: false
    },

    left: {
        pressed: false
    },

    down: {
        pressed: false
    },

    right: {
        pressed: false
    },
}

let lastKeyDown = ""

/*
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    player.drawPlayer()

})
*/

class Player {
    constructor(image) {
        this.position = {
            x: 100,
            y: 100,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.speed = 10
        
        this.jumpBoost = 15
        this.wheight = 20

        this.frames = 0

        this.sprites = {
            stand:{ 
                right: spriteStandRightImage,
                left: spriteStandLeftImage,
                cropWidth: 177,
                width: 66
            },
            run: {
                right: spriteRunRightImage,
                left: spriteRunLeftImage,
                cropWidth: 341,
                width: 127.875
            },
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = this.sprites.stand.cropWidth
        this.width =  this.sprites.stand.width
        /*
        spriteRunLeftImage
        spriteRunRightImage
        spriteStandLeftImage
        spriteStandRightImage
        */
        this.height = 150
    }

    drawPlayer() {
        
        c.drawImage(
            this.currentSprite,
            // cropping
            this.currentCropWidth * this.frames, //top left corner
            0, //bottom left corner
            this.currentCropWidth, //top right corner
            400, //bottom right corner
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )



    }

    updatePlayer() {
        this.drawPlayer()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        this.frames++

        // there is just 28 frames in the standing  sprite, so it creates a loop into it
        if(this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0
        // there is just 29 frames in the running sprite, so it creates a loop into it
        else if(this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0

        // This updates gravity


        // if the bottom of the player reaches the bottom of the screen it will stop 
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        // else
        //     this.velocity.y = 0
    }

    actions = class actions {
        static jump() {
            player.velocity.y -= player.jumpBoost
        }

        static fall() {
            player.velocity.y += player.wheight
        }
    }

}



class Platform {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }

        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y
        )
    }

}



class GenericObject {
    constructor({x, y, image, parallax}) {
        this.position = {
            x,
            y
        }

        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.parallax = parallax;
        
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y
        )
    }

}


function handleAnimateMoves() {

    console.log(player.position.x)

    console.log(scrollOffset)
    if(
        lastKeyDown === "right" 
        && player.currentSprite !== player.sprites.run.right
    ){
        player.frames = 1;
        player.currentSprite = player.sprites.run.right

        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }

    else if(
        lastKeyDown === "left" 
        && player.currentSprite !== player.sprites.run.left
    ){
        player.frames = 1;
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }

    else if(
        !keys.left.pressed
        && lastKeyDown === "left" 
        && player.currentSprite !== player.sprites.stand.left
    ){
        player.frames = 1;
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }
    else if(
        !keys.right.pressed
        && lastKeyDown === "right" 
        && player.currentSprite !== player.sprites.stand.right
    ){
        player.frames = 1;
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }



    if (keys.right.pressed
        && player.position.x < MAX_RIGHT_POSITION_BEFORE_SCROLL // to animate background
    ) {
        player.velocity.x = player.speed
    }

    else if (
        (
        keys.left.pressed
        && player.position.x > MIN_RIGHT_POSITION_BEFORE_SCROLL // to animate background
        )
        || (keys.left.pressed
        && scrollOffset == 0
        && player.position.x > 0
        )
    ) {
        player.velocity.x = -player.speed
    }


    else {
        player.velocity.x = 0

        // starts to animate the background scrolling to right
        if (keys.right.pressed) {
            // it imitates a parallax
            platforms.map(
                platform => {
                    platform.position.x -= player.speed
                }
            )


            genericObjects.map(
                genericObject => {
                    genericObject.position.x  -= genericObject.parallax
                }
            )

            
            scrollOffset += player.speed

        }

        // starts to animate the background scrolling to left
        if (keys.left.pressed
            && scrollOffset > 0) {
            // it imitates a parallax
            platforms.map(
                platform => {
                    platform.position.x += player.speed
                }
            )


            genericObjects.map(
                genericObject => {
                    genericObject.position.x  += genericObject.parallax
                }
            )

            scrollOffset -= player.speed
        }

    }
}

let player = new Player()
let platforms = []

let genericObjects = []
// player.updatePlayer()

init()
const animate = () => {
    // this create a loop
    requestAnimationFrame(animate)
    // maintain the player's shape
    // c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)


    // genericObjects updates!
    genericObjects.map(
        genericObject => {
            genericObject.draw()
        }
    )

    // platform updates!
    platforms.map(
        platform => {
            platform.draw()
        }
    )

    

    // animate moves
    handleAnimateMoves()

    platforms.map(
        platform => {
            // left side collision
            const isPlayerBeforePlatform = player.position.x + player.width >= platform.position.x;

            // right side collision
            const isPlayerAfterPlatform = player.position.x <= platform.position.x + platform.width;

            const isPlayerBottomAbovePlatform = player.position.y + player.height // bottom of the player
                <= platform.position.y      // is above the platform
                //prevents the player go upper than the platform 
                && player.position.y + player.height + player.velocity.y >= platform.position.y;



            // handle the platforms collision
            if (
                //collision
                isPlayerBottomAbovePlatform
                // left side collision
                && isPlayerBeforePlatform
                // right side collision
                && isPlayerAfterPlatform
            ) {
                player.velocity.y = 0
            }
        }
    )

    //player wins!
    if(scrollOffset >= END_OF_LEVEL){
        // window.alert("YOU WIN, perfect!")

        init()
    }

    if(player.position.y > canvas.height){
        // window.alert("YOU WIN, perfect!")

        init()
    }

    

    //player has the maximun z-index doing that! 
    player.updatePlayer()
}

animate()

// keys handler

// Animations

/*
When the key is down, it is pressed, when the key is up it was unpressed
*/

window.addEventListener('keydown', ({ keyCode }) => {
    handleCrontrolPlayer(keyCode)
})


window.addEventListener('keyup', ({ keyCode }) => {
    handleStopPlayer(keyCode)
})

function handleCrontrolPlayer(keyCode) {
    switch (keyCode) {
        // For WASD
        case 87: //w
            actions.jump()
            break;
        case 65: //a
            actions.goLeft()
            break;
        case 83: //s
            actions.goDown()
            break;
        case 68: //d
            actions.goRight()
            break;

        // For Arrows
        case 38: //up
            actions.jump()
            break;
        case 37: //left
            actions.goLeft()
            break;
        case 40: //down
            actions.goDown()
            break;
        case 39: //right
            actions.goRight()
            break;
    }

}

function handleStopPlayer(keyCode) {
    switch (keyCode) {
        // For WASD
        case 87: //w
            actions.stopJump()
            break;
        case 65: //a
            actions.stopLeft()
            break;
        case 83: //s
            actions.stopDown()
            break;
        case 68: //d
            actions.stopRight()
            break;

        // For Arrows
        case 38: //up
            actions.stopJump()
            break;
        case 37: //left
            actions.stopLeft()
            break;
        case 40: //down
            actions.stopDown()
            break;
        case 39: //right
            actions.stopRight()
            break;
    }


}


class actions {
    static jump() {
        keys.up.pressed = true
        player.actions.jump()
    }

    static goLeft() {
        keys.left.pressed = true

        lastKeyDown = "left"
    }


    static goDown() {
        keys.down.pressed = true
    }

    static goRight() {
        keys.right.pressed = true

        lastKeyDown = "right"
    }


    static stopJump() { 
        keys.up.pressed = false

    }


    static stopLeft() {
        keys.left.pressed = false

        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width

        lastKeyDown = ""
    }


    static stopDown() {
        keys.down.pressed = false
        player.actions.fall()
    }

    static stopRight() {
        keys.right.pressed = false

        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width


        lastKeyDown = ""
    }
}



function init(){
    scrollOffset = 0;

    player = new Player();
    
    platforms = [
        new Platform({x: FLOOR_PLATFORM_X(platformSmallTallImage) + 200, y: FLOOR_PLATFORM_Y(platformSmallTallImage) - 100  , image: platformSmallTallImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformSmallTallImage), y: FLOOR_PLATFORM_Y(platformSmallTallImage)        , image: platformSmallTallImage}),
        new Platform({ x: 0                                      , y: FLOOR_PLATFORM_Y(platformImage)                 , image: platformImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage)         , y:       FLOOR_PLATFORM_Y(platformImage)           , image: platformImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *3 + 389, y: FLOOR_PLATFORM_Y(platformSmallTallImage) - 100  , image: platformSmallTallImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *3 + 150, y: FLOOR_PLATFORM_Y(platformSmallTallImage)        , image: platformSmallTallImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *2 + 100, y: FLOOR_PLATFORM_Y(platformImage)                 , image: platformImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *3 + 100, y: FLOOR_PLATFORM_Y(platformImage)                 , image: platformImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *4 + 200, y: FLOOR_PLATFORM_Y(platformSmallTallImage) * .6   , image: platformSmallTallImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *5 + 200, y: FLOOR_PLATFORM_Y(platformSmallTallImage) * .3   , image:   platformSmallTallImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *6 + 400, y: FLOOR_PLATFORM_Y(platformSmallTallImage) * .8   , image:   platformSmallTallImage}),
        new Platform({x: FLOOR_PLATFORM_X(platformImage) *7 + 400, y: FLOOR_PLATFORM_Y(platformSmallTallImage)        , image:   platformSmallTallImage}),
        ];

    genericObjects = [
        new GenericObject({ x: -1 , y: -1, image: backgroundImage, parallax: 0}),
        new GenericObject({ x: 10 , y: -1, image: hillsImage     , parallax: 2}),
        new GenericObject({ x: 700 , y: 50, image: hillsImage     , parallax: 3}),
        new GenericObject({ x: 1200  , y: 120, image: hillsImage     , parallax: 4}),
        new GenericObject({ x: 2400  , y: 120, image: hillsImage     , parallax: 4}),
        ];
}