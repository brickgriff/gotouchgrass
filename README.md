<!-- Mother's Hip Productions presents -->
<!-- a Griffin Games experience -->
# Go Touch Grass
<!-- 
  keywords: clicker, idle, incremental, nature, eco, 
    solarpunk, permaculture, crafting, educational, 

-->
## Food Forest Simulator


### Screen <!-- Air/Space -->
- [ ] HTML Canvas
  - [ ] colors
  - [ ] shapes
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
  - [ ] walking speed in state
  - [ ] zoom level in state
- [ ] simulations
- [ ] score
- [ ] save data system
- [ ] SPRNG (seeded pseudo-random number generator)

### Entities <!-- Earth/Matter -->
- [ ] player
- [ ] foliage
- [ ] terrain
- [ ] pathways
- [ ] walls
- [ ] objects

### Events <!-- Fire/Energy -->
- [x] resize
- [ ] pause
- [ ] quit
- [ ] keyboard
- [ ] mouse
  - [ ] mouseup
  - [ ] mousedown
  - [ ] mousemove
  - [ ] mousescroll
- [ ] touch

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