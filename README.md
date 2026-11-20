# Rushik's Portfolio

A self-contained portfolio with an actual WebGL 3D telescope, metallic surfaces, glass optics, a hollow optical barrel, and a scroll-controlled camera path. An animated black hole, pulsar, and comet open About, Learning, and Education. A 3D astronaut searching for a radio signal opens Contacts. The interface includes smooth scrolling, section navigation, a phone navigation dock, progressive text reveals, and a reduced-motion control. Three.js and Lenis are bundled locally; no installation or build is needed. Google Fonts is optional.

## Preview your website

1. Open the `dist` folder.
2. Double-click `index.html` to open your portfolio in a browser.
3. Scroll through the telescope, then select a cosmic object. Try the section navigation, Explore menu, and Motion button. Resize the browser to check the phone layout.

## Save your first commit

A commit is a saved snapshot of your files. Open this `rushik-portfolio` folder in VS Code and choose **Terminal → New Terminal**.

If this folder has not been set up with Git yet, run:

```sh
git init
```

Then save the website snapshot:

```sh
git add dist README.md
git commit -m "Build my first portfolio"
```

If Git asks who you are, enter your own name and email using the instructions it displays, then repeat the commit command. Use `git log --oneline -1` to see your saved snapshot. A commit saves files on your computer; sharing online is a separate step.

## Make it yours

Edit `dist/index.html` for your text, `dist/style.css` for colors and layout, and `dist/app.js` for the telescope scene and motion. Save your edits and refresh the browser. Only personal information supplied by Rushik is included; no projects, contact details, skills, or social links have been invented.

## Optional space ambience

Click **Sound: off** to enable a quiet, locally generated ambient soundtrack. Click again to mute. Sound starts off on each visit, fades gently, and pauses while the tab is hidden. No external audio files or services are used.

## Steer the telescope

Choose **Steer telescope** on the home page. Drag with a mouse or swipe on a phone to aim. Arrow keys also steer. Use the zoom slider, **Reset view** (or R), and **Exit telescope** (or Escape). Click the labeled black hole, pulsar, comet, or astronaut to visit the associated portfolio content. Exiting returns you to the page without changing your scroll position.


## Opening universe animation

Each page load starts with a short accelerating star tunnel and expanding cosmic burst, then reveals the portfolio. Choose **Skip intro** or press Escape to enter immediately. The soundtrack remains off until the visitor enables it.


## Cinematic celestial destinations

Select the black hole, pulsar, comet, or astronaut from the universe map or telescope view. A roughly 2.5-second perspective camera journey passes through an original dark void with accelerating white, cyan, and violet light fragments at different depths. The motion falls into a short still moment, then the void blends away over 0.6 seconds to reveal the selected object in the split destination view. Celestial objects and galaxies remain hidden during travel. Desktop layouts use a 50% information panel and 50% celestial view; phone layouts stack the object above the scrollable information. Cancel, Universe map, and Back to telescope remain available. Reduced motion shortens the transition and disables the void effect.

The universe overview keeps simpler animated markers. Detailed models appear after arrival: a ray-bent black-hole accretion disk, rotating pulsar beams, a rocky comet with flowing tails, and an astronaut with an animated receiver. The camera follows a gently curved approach before settling into the right half of the desktop screen.

Celestial visuals are original illustrative 3D models, not a scientific simulation or a true-scale representation. Their motion is inspired by NASA guides on black-hole accretion, rotating pulsar beams, nebula gas, and comet dust and ion tails. 


## Close-up models and controls

The four destinations are Black hole / About, Pulsar / Learning, Comet / Education, and Astronaut / Contacts. The nebula destination has been removed. All close-ups use local procedural 3D geometry or shaders; no model downloads are needed.

After arrival, drag or swipe on the object area for full horizontal 360-degree rotation and vertical tilt. Arrow keys also work. Choose Reset view or press R to restore the starting angle. The astronaut floats gently, turns its helmet, and raises a receiver with expanding signal rings. Contacts includes the supplied email, GitHub, and LinkedIn links.

## Interactive radio

Open Contacts, then click the astronaut's radio or choose Connect radio. A brief signal search and expanding pulse reveal email, GitHub, and LinkedIn. The radio target follows the 3D model while rotating. Send another signal replays the pulse. Drag gestures rotate without triggering the radio; the accessible button works with keyboard navigation. Reduced motion reveals contacts immediately.


## Interactive star map

Choose Star map from any portfolio section or Steer telescope on the home page. The compact map in the telescope view shows Black hole / About, Pulsar / Learning, Comet / Education, and Astronaut / Contacts. Choose a marker to smoothly aim the telescope; Explore opens the selected destination. Minimise collapses the map. Manual steering or Reset clears its target selection.


## Performance

Hidden universe-map animations pause during telescope viewing and destination screens. Only the selected close-up model animates, and travel fragments stop updating after arrival. Star glow is cached instead of recalculated with a blur for every star. Rendering resolution starts with a lower pixel-density cap and adapts gradually to slow frames. The star density and interaction controls are retained.

