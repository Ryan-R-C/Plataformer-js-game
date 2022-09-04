
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const gravity = 0.5

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




addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  player.drawPlayer()

})

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

        this.width  = 50
        this.height = 50
    }

    drawPlayer(){
        c.fillStyle = "blue"
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    updatePlayer(){
        this.drawPlayer()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // This updates gravity


        // if the bottom of the player reaches the bottom of the screen it will stop 
        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
        else 
            this.velocity.y = 0
    }

    actions = class actions{
        static jump(){
            player.velocity.y -= 20
        }   
    }

}



class Platform {
    constructor(){
        this.position = {
            x: 200,
            y: 200
        }

        this.width  = 200; 
        this.height = 20;
    }

    draw(){
        c.style = "blue"
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        )
    }

}



function handleAnimateMoves(){
    if(keys.right.pressed){
        player.velocity.x = 5
    }


    else if(keys.left.pressed){
        player.velocity.x = -5
    }


    else{
        player.velocity.x = 0
    }
}

const player = new Player()
const platform = new Platform()
// player.updatePlayer()

const animate = () => {
    // this create a loop
    requestAnimationFrame(animate)
    // maintain the player's shape
    c.clearRect(0, 0, canvas.width, canvas.height)    
    player.updatePlayer()

    // platform updates!
    platform.draw()


    handleAnimateMoves()
}

animate()   

// keys handler

// Animations

/*
When the key is down, it is pressed, when the key is up it was unpressed
*/

window.addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode)
    handleCrontrolPlayer(keyCode)  
})


window.addEventListener('keyup', ({ keyCode }) => {
    console.log(keyCode)
    handleStopPlayer(keyCode)  
})

function handleCrontrolPlayer(keyCode){
    switch(keyCode){
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

    console.log(keys.right.pressed)
}

function handleStopPlayer(keyCode){
    switch(keyCode){
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

    console.log(keys.right.pressed)

}


class actions{
    static jump(){
        keys.up.pressed = true
        player.velocity.y -= 20
        console.log("run")
    }

    static goLeft(){
        keys.left.pressed = true
        // player.velocity.x -= 20
    }


    static goDown(){
        keys.down.pressed = true
        player.velocity.y += 20
    }

    static goRight(){
        keys.right.pressed = true
        // player.velocity.x = 20
    }


    static stopJump(){
        keys.up.pressed = false
        console.log("stop")
    }


    static stopLeft(){
        keys.left.pressed = false
        console.log("stop")

    }


    static stopDown(){
        keys.down.pressed = false
        console.log("stop")

    }

    static stopRight(){
        keys.right.pressed = false
        console.log("stop")

    }
}
