# Plataformer JS Game

![](https://i.ibb.co/bgjkSw7/Screenshot-from-2022-09-26-16-09-48.jpg)

This is a platformer game developed entirely from scratch, without the use of frameworks or external libraries. All logic and structure were built using pure HTML, CSS, and JavaScript.

The game features a character that can move sideways and jump. The level resets automatically when completed or if the player falls off the map, providing a simple and effective gameplay mechanic.

The development process was both engaging and enjoyable. By reverse engineering the classic "Super Mario World", I studied and drew inspiration from its behaviors and mechanics to adapt the game to a well-established standard within the platformer genre.

Rendering was done using the "&lt;canvas&gt;" tag, with entities modeled as reusable objects, following best practices for code organization and readability.


## Features

- Player movement (left, right, jump)
- Parallax background
- Platform collision
- Sprite animations

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ryan-R-C/Plataformer-js-game.git
   cd Plataformer-js-game
   ```

2. **Open the game:**
   - Open `src/index.html` in your web browser.

## Controls

- **Move Left:** `A` or `Left Arrow`
- **Move Right:** `D` or `Right Arrow`
- **Jump:** `W` or `Up Arrow`

## Project Structure

- `src/js/` - JavaScript source files
- `src/index.html` - Main HTML file