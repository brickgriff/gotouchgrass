<!-- Mother's Hip Productions presents -->
<!-- a Griffin Games experience -->
# Go Touch Grass
<!-- 
  keywords: clicker, idle, incremental, nature, eco, 
    solarpunk, permaculture, crafting, educational, 

-->
### Food Forest Simulator

## Overview

## Install

## Play

## Issues

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
  - [x] normalize diagonal movement
  - [x] normalize entity placement
  - [x] walking speed in state
  - [ ] zoom level in state
  - [ ] scale speed to framerate
- [ ] simulations
- [ ] score
- [ ] save data system
- [ ] numbers
  - [x] seeded pseudo-random number generator (SPRNG)
  - [ ] procedural generation
  - [ ] noise
  - [ ] signed distance functions
  - [ ] wave form collapse

### Entities <!-- Earth/Matter -->
- [x] player
- [ ] foliage
- [ ] terrain
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

- [x] make sure the dynamic canvas plays nicely with the browser frame in itch.io
  - [x] looks like it keeps a square aspect ratio; it doesn't update when self/window/document changes
  - [x] double-confirm which events get fired, if any
- [ ] automate zip file creation
  - [x] command line script ready
    - double-confirm proper archive structure
  - [x] try using
    - winrar (not yet installed)
    - gzip (just a compression algo)
    - tar (creates tarballs, not zip files)
    - tar.exe (creates tarballs, not zip files)
    - jar (seems to work the best)
    - 7z (???)
  - [x] order of operations
    - dev using stackblitz or sublime (feature branch)
    - version control with github (push into work)
    - archive locally with jar (after pull from work)
    - upload to itch.io (then refresh)
  - [ ] can GitHub Actions/Deployments do this?
  - [x] why are simulated inputs so buggy (gamepad)
    - [x] now that mousemove works, keyboard is buggy!

## Next Goals
Basically I want to implement feedback (events and animations):
- [x] there's currently an implied visibility horizon (~1m dia)
- [ ] there should be a halo around the currently "selected" plant
- [x] there should be a gray outline that persists after the player moves far away (plant state)
- [ ] develop state management/machine for simulations
- [ ] setup framework for adding ecosystem parameters
- [ ] rework debug menu (top or right)
- [ ] dev console (top or right)
- [ ] worker services
- [ ] off-screen canvas for sprites (and collision detection)