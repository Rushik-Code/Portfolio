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

