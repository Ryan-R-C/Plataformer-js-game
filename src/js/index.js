
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


const player = new Player()
// player.updatePlayer()

const animate = () => {
    // this create a loop
    requestAnimationFrame(animate)
    // maintain the player's shape
    c.clearRect(0, 0, canvas.width, canvas.height)    
    player.updatePlayer()



    // handleAnimateMoves()
}

animate()   