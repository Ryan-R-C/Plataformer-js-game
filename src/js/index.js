const canvas = document.querySelector('canvas');


canvas.width =  1024; // innerWidth
canvas.height = 576; // innerHeight

const c = canvas.getContext('2d');
const gravity = 0.5;


const MAX_RIGHT_POSITION_BEFORE_SCROLL = 400;
const MIN_RIGHT_POSITION_BEFORE_SCROLL = 100;

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



const END_OF_LEVEL = 500;

const FLOOR_PLATFORM_Y = canvas.height - platformImage.height;
const FLOOR_PLATFORM_X = platformImage.width - 2;

let scrollOffset = 0; // how much the player has moved


const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']



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



/*
addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    player.drawPlayer()

})
*/

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.width = 50
        this.height = 50
    }

    drawPlayer() {
        c.fillStyle = "blue"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    updatePlayer() {
        this.drawPlayer()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // This updates gravity


        // if the bottom of the player reaches the bottom of the screen it will stop 
        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else
            this.velocity.y = 0
    }

    actions = class actions {
        static jump() {
            player.velocity.y -= 20
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

    if (keys.right.pressed
        && player.position.x < MAX_RIGHT_POSITION_BEFORE_SCROLL // to animate background
    ) {
        player.velocity.x = 5
    }

    else if (keys.left.pressed
        && player.position.x > MIN_RIGHT_POSITION_BEFORE_SCROLL // to animate background
    ) {
        player.velocity.x = -5
    }


    else {
        player.velocity.x = 0

        // starts to animate the background scrolling to right
        if (keys.right.pressed) {
            // it imitates a parallax
            platforms.map(
                platform => {
                    platform.position.x -= 5
                }
            )


            genericObjects.map(
                genericObject => {
                    genericObject.position.x  -= genericObject.parallax
                }
            )

            
            scrollOffset += 5

        }

        // starts to animate the background scrolling to left
        if (keys.left.pressed) {
            // it imitates a parallax
            platforms.map(
                platform => {
                    platform.position.x += 5
                }
            )


            genericObjects.map(
                genericObject => {
                    genericObject.position.x  += genericObject.parallax
                }
            )

            scrollOffset -= 5
        }

    }
}

const player = new Player()
const platforms = [
    new Platform({ x: 0                 , y: FLOOR_PLATFORM_Y, image: platformImage}),
    new Platform({x: FLOOR_PLATFORM_X   , y: FLOOR_PLATFORM_Y, image: platformImage}),
    new Platform({x: FLOOR_PLATFORM_X *2, y: FLOOR_PLATFORM_Y, image: platformImage}),
    new Platform({x: FLOOR_PLATFORM_X *3, y: FLOOR_PLATFORM_Y, image: platformImage}),
    ]

const genericObjects = [
    new GenericObject({ x: -1 , y: -1, image: backgroundImage, parallax: 0}),
    new GenericObject({ x: -1 , y: -1, image: hillsImage     , parallax: 2}),
    new GenericObject({ x: 200 , y: 100, image: hillsImage     , parallax: 3}),

]
// player.updatePlayer()

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

    if(scrollOffset >= END_OF_LEVEL){
        window.alert("YOU WIN, perfect!")

        player.position.x = 0
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
        player.velocity.y -= 20
    }

    static goLeft() {
        keys.left.pressed = true
        // player.velocity.x -= 20
    }


    static goDown() {
        keys.down.pressed = true
        player.velocity.y += 20
    }

    static goRight() {
        keys.right.pressed = true
        // player.velocity.x = 20
    }


    static stopJump() {
        keys.up.pressed = false
    }


    static stopLeft() {
        keys.left.pressed = false

    }


    static stopDown() {
        keys.down.pressed = false
    }

    static stopRight() {
        keys.right.pressed = false

    }
}
