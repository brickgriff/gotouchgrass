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
Go Touch Grass is a top-down puzzle-like experience where you play as a rookie community land steward. This demo is designed as a self-paced tutorial and a proof-of-concept.
## Install
**Checkout the repo (_link_) or download the zip archive(_link_)**, fetch or extract the files, then open `index.html` in your favorite browser.

## Play

**Move** : ESDF Keys, Left Mouse Drag, Pan (Touchscreen)

> Observe plants directly underfoot at minimal cost.

**Play\*** : Spacebar, Left Mouse Click, Tap (Touchscreen)

> Observe plants within range at moderate cost.

**Rest\*** : No Action (3s)

> Observe plants within range at no cost; slowly restores stamina.

_* Feature currently under development._

_Further information can be found on the wiki (_link_)._
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

## Overview
Go Touch Grass is an interactive experience that puts players through an accelerated introduction to ecology concepts.

Biologicial Succession

## Install
Go Touch Grass is shipped as self-contained HTML package that can be played on any browser that supports HTML 5 (Canvas).

## Play
Go Touch Grass is designed to have minimalistic and intuitive play. All interactions are accepted: keyboard, mouse, and touch (mobile).

### Controls
- Rest (no input)
  - Causes no Disturbance
  - Activates nearby Plants
  - Reveals next Target
- Walk (drag)
  - Causes low Disturbance
  - Activates touched Plants
  - Reveals nearby Plants
- Feel (click/tap)
  - Causes high Disturbance
  - Activates nearby Plants
  - Remove last Target

### Map
The map consists of the immediate area around a large park with a grass field, walking paths, trees, fences, and other features. The player will start outside the gate at the information desk. If the player does not receive a key from the desk, their observations will not grant new skills. With the key, individual plants can be distinguished, not just patches.
There is a walking path leading from the gate to a jogging track around the center of the park. There are several small trees around the track and larger trees near the fence. There are natural paths throughout the wooded areas.

---
# PATCH v0.1.5

- setup
  - Canvas helpers and other utils
  - screen resize event handling
  - limited color palatte theme
  - 
- world: key stats and classes
  - state
    - canvas,ctx
    - width,height,mindim
    - dx,dy
    - speed
  - entities
    - player
    - foliage
      - grass
      - clover
    - artifice
      - pad-lock
      - pay-gate
    - items
      - plastic bag
      - kick ball
- display: systemic simulation simplified
  - violet (interactable)
    - typically top visual priority
    - should guide the player's eye
    - serves as the theme's black value
    - represents agency
  - mint (client)
    - typically low visual priority
    - should allow the player's eyes relax
    - serves as background or contrast to violet
    - you're here to help the plants, they're your "clients"
    - represents grace
  - rose (rival)
    - typically average-to-high visual priority
    - serves as a caution to the player
    - gives visual scale to stakes
    - represents passion
  - dandelion (partner)
    - typically average-to-low visual priortiy
    - serves as incentive to the player
    - gives visual space for action
    - represents sense
  - common concepts
    - colors are linked to status, "like cures like"
    - broken lines represent incomplete, untapped, or otherwise unavailable resources
    - I'm lazy so "animations" will be staged
- events: intuitive integrated interface


