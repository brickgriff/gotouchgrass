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
  - [ ] normalize diagonal movement
  - [ ] walking speed in state
  - [ ] zoom level in state
- [ ] simulations
- [ ] score
- [ ] save data system

### Entities <!-- Earth/Matter -->
- [ ] player
- [ ] plants/foliage
- [ ] soil/terrain
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
  - looks like it keeps a square aspect ratio; it doesn't update when self/window/document changes
  - double-confirm which events get fired, if any
- [x] automate zip file creation
  - command line script ready
  - try using
    - winrar (not yet installed)
    - gzip (just a compression algo)
    - tar (creates tarballs, not zip files)
    - tar.exe (creates tarballs, not zip files)
    - jar (seems to work the best)
    - 7z (???)