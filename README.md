# Rushik's Portfolio

A self-contained portfolio with an actual WebGL 3D telescope, metallic surfaces, glass optics, a hollow optical barrel, and a scroll-controlled camera path. An animated black hole, pulsar, and nebula open About, Learning, and Education. The interface includes smooth scrolling, section navigation, a phone navigation dock, progressive text reveals, and a reduced-motion control. Three.js and Lenis are bundled locally; no installation or build is needed. Google Fonts is optional.

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

Choose **Steer telescope** on the home page. Drag with a mouse or swipe on a phone to aim. Arrow keys also steer. Use the zoom slider, **Reset view** (or R), and **Exit telescope** (or Escape). Click the labeled black hole, pulsar, nebula, or comet to visit the associated portfolio content. Exiting returns you to the page without changing your scroll position.


## Opening universe animation

Each page load starts with a short accelerating star tunnel and expanding cosmic burst, then reveals the portfolio. Choose **Skip intro** or press Escape to enter immediately. The soundtrack remains off until the visitor enables it.


## Cinematic celestial destinations

Select the black hole, pulsar, nebula, or comet from the universe map or telescope view. A roughly 2.5-second perspective camera journey passes through an original dark void with accelerating white, cyan, and violet light fragments at different depths. The motion falls into a short still moment, then the void blends away over 0.6 seconds to reveal the selected object in the split destination view. Celestial objects and galaxies remain hidden during travel. Desktop layouts use a 50% information panel and 50% celestial view; phone layouts stack the object above the scrollable information. Cancel, Universe map, and Back to telescope remain available. Reduced motion shortens the transition and disables the void effect.

The universe overview keeps simpler animated markers. Detailed models fade in during the approach: a ray-bent black-hole accretion disk, rotating pulsar beams, photographic nebula filaments with subtle depth and drift, and a rocky comet with flowing tails. The camera follows a gently curved approach before settling into the right half of the desktop screen.

Celestial visuals are original illustrative 3D models, not a scientific simulation or a true-scale representation. Their motion is inspired by NASA guides on black-hole accretion, rotating pulsar beams, nebula gas, and comet dust and ion tails. Each destination links to its NASA object guide.


## Close-up visual assets

The nebula uses a blue reflection-cloud design with a dark central cavity, silver filaments, depth-separated stars, and gentle gas drift. It is an original AI-generated astronomical illustration, not an actual NASA photograph. Its photographic texture is stored at `dist/assets/nebula-reflection-v2.png`, combined with gentle gas drift and depth-separated stars. The other close-ups use animated procedural 3D surfaces and shaders: ray-bent turbulent accretion light, luminous pulsar plasma, and high-resolution rocky comet geometry with fine relief and directional shading. These remain artistic visualizations rather than exact scientific reconstructions.

The nebula asset was created with the built-in image generator. Prompt: “Original photographic astronomical illustration for a WebGL close-up: a wide wispy blue reflection nebula, silver-blue translucent gas curling around a deep dark central cavity, intricate threadlike filaments and charcoal molecular dust, a few warm ivory stars embedded at varying depths. Natural restrained astrophotography, extremely detailed gas scattering, luminous but never neon. Completely different from orange pillars of creation. A sculptural asymmetric horseshoe of gas with dark open space at center; subject contained in central 80 percent of square image, fading gradually into pure black on all four edges. No text, labels, frames, planets, solid surface, cartoons, purple cotton blobs, or excessive star spikes. Fine photographic detail, elegant cinematic depth.”

The black hole has a slimmer edge-on disk, radial luminosity falloff, orbiting turbulence, a brighter approaching side, and a completely dark captured-ray shadow.

## Rotate close-up objects

After arrival, drag on the object view or swipe on a phone to orbit through a full 360 degrees horizontally and tilt vertically. Focus the viewer and use arrow keys for keyboard control. Choose Reset view or press R to restore the starting angle. The black-hole ray shader changes its view of the disk with the orbit; the nebula is rendered as a textured gas volume so it has depth from side and rear views. Pulsar and comet retain their animated 3D geometry. These are illustrative reconstructions.
