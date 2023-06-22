# Planifyit Runner Widget

![Planifyit Logo](https://planifyit.github.io/Pie_chart/PlanifyIT_Logo2.png)

## Overview
Planifyit Runner Widget is an SAC custom widget for SAP Analytics Cloud that allows users to embed an interactive running game within their analytics dashboard. The widget features a running game where a player has to jump over obstacles and dunk to avoid top obstacles. It has start, jump, dunk, and pause functionalities and displays the score during gameplay.

## Version
1.0.1

## Features
- Interactive running game.
- Jump and dunk controls to avoid obstacles.
- Pause functionality to pause/resume the game.
- Displays the score during gameplay.
- Stores top scores in local storage.

## Getting Started
### Add Widget to SAC
To add this widget to your SAP Analytics Cloud dashboard, follow these steps:
1. Download the `PlanifyitRunnerWidget.js` file.
2. In your SAC dashboard, add a new custom widget and provide the required fields according to `Planifyit_Runner.json`.

### Configure Widget
- **width**: (integer) The width of the game container. Default is 300.
- **height**: (integer) The height of the game container. Default is 400.

## Methods
- **startGame**: Starts the Planifyit Runner game.
- **endGame**: Ends the current game.

## Events
- **onGameEnd**: This event is called when the game ends.
- **onScoreUpdate**: This event is called when the player's score is updated.

## Data Bindings
- **myDataBinding**: This data binding can be used for further customization, with dimensions and measures as feeds.

## Dependencies
No external dependencies.

## Vendor
Planifyit

## License
This project is licensed under the vendor "Planifyit".

## Support
For support, please contact the vendor at [Planifyit Support](mailto:support@planifyit.com).

## Disclaimer
This widget is provided by Planifyit and has no affiliation with SAP. 
