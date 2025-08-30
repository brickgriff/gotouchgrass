<!-- the Mother's Hip Garden presents -->
<!-- in association with House of Ease -->
<!-- a Griffin Games experience -->
# Go Touch Grass
<!-- 
  keywords: clicker, idle, incremental, nature, eco, 
    solarpunk, permaculture, crafting, educational, 
    puzzle, adventure, roguelite, gardening, 
    minimalist, cozy, stewardship, rematriation,
-->
### Minimalist Ecology Simulator

## Overview

## Install

## Play

## Support
### GitHub Contributions
### Itch.io Browser Plays
### Twitch
### Patreon

## Design
### Screen <!-- Air/Space -->
- [ ] HTML Canvas
  - [x] colors
  - [x] shapes
  - [ ] gradients
  - [ ] modes
- [ ] draw background
  - [X] css for both canvas and html,body
  - [ ] dynamic feedback
<!-- - [ ] 3d??? -->

### State <!-- Water/Time -->
- [x] calculate frames per second
- [ ] animations
  - [x] normalize _diagonal_ movement
  - [x] normalize entity placement; circularize
  - [ ] fix unnatural _clustering_ due to random placement
  - [x] walking speed in state
  - [ ] zoom level in state
  - [ ] scale speed to framerate
- [ ] simulations
- [ ] score
  - [x] experience 
  - [x] stamina
  - [ ] traits
  - [ ] keys
- [ ] save data system
- [ ] numbers
  - [x] seeded pseudo-random number generator (SPRNG)
  - [ ] procedural generation
  - [ ] noise
  - [ ] signed distance functions
  - [ ] wave form collapse

### Entities <!-- Earth/Matter -->
- [x] player
- [ ] plants
- [x] terrain
- [ ] pathways
- [ ] walls
- [ ] objects

### Events <!-- Fire/Energy -->
- [x] resize
- [ ] pause
- [ ] quit
- [x] keyboard
- [x] mouse
  - [x] mouseup
  - [x] mousedown
  - [x] mousemove
  - [ ] mousescroll
- [x] touch
- [ ] gyro/orientation
  - [ ] 6-axis tilt (orientation, pitch, twist, etc)
  - [ ] velocity
  - [ ] shake
- [ ] errors

### Goals
- [x] make sure the dynamic `canvas` plays nicely with the browser frame on **Itch.io**
  - [x] looks like it keeps a _square_ aspect ratio; it doesn't update when `self`/`window`/`document` changes; preview is a static 600px by 600px square by default
  - [x] double-confirm which events get fired, if any (touch)
  - [ ] check if using `self` vs `window` vs `document` works as expected in the browser player
- [ ] automate zip file creation
  - [x] command line script ready; double-confirm proper archive structure
  - [x] try using
    - `winrar` (not yet installed)
    - `gzip` (just a compression algo)
    - `tar` (creates tarballs, not zip files)
    - `tar.exe` (creates tarballs, not zip files)
    - `jar` (seems to work the best)
    - `7z` (???)
  - [x] order of operations
    - develop using **StackBlitz** or **Sublime** (feature branch)
    - pull request via **GitHub** (push into `work`)
    - archive locally with `jar` (after pull from `work`)
    - upload to **Itch.io** (then refresh)
  - [ ] can **GitHub** Actions/Deployments do this?
  - [x] why are simulated inputs so buggy (gamepad)
    - [x] now that `mousemove` works, keyboard is buggy!
- [ ] Basically I want to implement feedback (events and animations):
- [x] there's currently an implied visibility horizon (~1m dia)
- [x] there should be a halo around the currently "selected" plant (type species zone)
- [x] there should be a gray outline that persists after the player moves far away (plant state)
- [ ] develop state management/machine for simulations
- [ ] setup framework for adding ecosystem parameters
- [ ] rework debug menu
- [ ] developer console
- [ ] worker services
- [x] `OffScreenCanvas` for backgrounds, sprites, and collision detection
- [ ] entity editor/viewer; modify exeperience meters