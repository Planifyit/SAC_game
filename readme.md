# Planifyit Runner Widget README

## Introduction

The Planifyit Runner Widget is a web component that allows you to integrate a simple runner game into your web application. It has a game character that tries to avoid obstacles and increases the score as the game progresses.

![Planifyit Runner Game](https://planifyit.github.io/Pie_chart/PlanifyIT_Logo2.png)

## Features

- Start, pause, and replay game controls
- Jump and dunk actions for the game character
- Real-time score tracking
- Top scores tracking using local storage
- Collision detection between the character and obstacles

## Getting Started

1. Include the Planifyit Runner Widget by adding the JavaScript file to your HTML:

```html
<script src="https://planifyit.github.io/SAC_game/PlanifyitRunnerWidget.js" integrity="" crossorigin="anonymous"></script>
```

2. Add the widget to your HTML by using its custom HTML tag:

```html
<planifyit-runner-widget></planifyit-runner-widget>
```

3. Customize the widget dimensions by setting the width and height attributes:

```html
<planifyit-runner-widget width="500" height="300"></planifyit-runner-widget>
```

## Properties

- `width`: Integer that sets the width of the game container. Default is 300.
- `height`: Integer that sets the height of the game container. Default is 400.

## Methods

- `startGame`: Call this method to start the Planifyit Runner game.
- `endGame`: Call this method to end the current game.

Example usage:

```javascript
document.querySelector('planifyit-runner-widget').startGame();
```

## Events

- `onGameEnd`: This event is called when the game ends.
- `onScoreUpdate`: This event is called when the player's score is updated.

Example usage:

```javascript
const widget = document.querySelector('planifyit-runner-widget');
widget.addEventListener('onGameEnd', function () {
  console.log('Game Over');
});
```

## Data Bindings

This widget can be configured with data bindings to dimensions and measures in the form of feeds.

Example:

```javascript
{
  "myDataBinding": {
    "feeds": [
      {
        "id": "dimensions",
        "description": "Dimensions",
        "type": "dimension"
      },
      {
        "id": "measures",
        "description": "Measures",
        "type": "mainStructureMember"
      }
    ]
  }
}
```

## Contributing

If you have suggestions for how the Planifyit Runner Widget could be improved, or want to report a bug, open an issue! Contributions are welcomed.

## License

This project is licensed under the vendor "Planifyit".

## Support

For support or questions regarding the Planifyit Runner Widget, please contact the Planifyit team.
