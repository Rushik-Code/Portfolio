(() => {
'use strict';
const button=document.querySelector('#sound'),label=button.querySelector('.sound-label'),AudioEngine=window.AudioContext||window.webkitAudioContext;
let context,master,music,reverbSend,echoSend,enabled=false,fadeTimer,scheduler,nextChord=0,chordIndex=0;
const beat=60/68,bar=beat*8;
// An original eight-chord score: slow suspended harmonies with a recurring melody.
const score=[
 {bass:38,chord:[50,57,60,64],melody:[74,69,72,76,77,76,72,69]},
 {bass:34,chord:[53,57,60,65],melody:[77,72,69,72,76,72,69,65]},
 {bass:41,chord:[53,57,60,64],melody:[76,72,69,67,69,72,76,79]},
 {bass:36,chord:[52,55,62,67],melody:[79,76,74,72,74,76,72,67]},
 {bass:31,chord:[53,57,58,62],melody:[74,69,70,74,77,74,70,69]},
 {bass:34,chord:[53,57,60,65],melody:[72,77,76,72,69,72,69,65]},
 {bass:33,chord:[52,57,62,64],melody:[69,74,76,74,72,69,67,64]},
 {bass:33,chord:[52,57,60,64],melody:[72,76,74,72,69,67,64,69]}
];
const frequency=midi=>440*Math.pow(2,(midi-69)/12);
function paint(){button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Mute ambient sound':'Enable ambient sound');label.textContent=enabled?'Sound: on':'Sound: off';button.title='Orbital — an original cinematic ambient score';}
function build(){
 context=new AudioEngine();master=context.createGain();master.gain.value=0;
 const limiter=context.createDynamicsCompressor();limiter.threshold.value=-20;limiter.knee.value=20;limiter.ratio.value=3;limiter.attack.value=.025;limiter.release.value=.5;master.connect(limiter);limiter.connect(context.destination);
 music=context.createGain();music.gain.value=.75;
 const warmth=context.createBiquadFilter();warmth.type='lowpass';warmth.frequency.value=3200;warmth.Q.value=.3;music.connect(warmth);warmth.connect(master);
 // A stereo hall with a soft attack, so the melody floats rather than clicks.
 const convolver=context.createConvolver(),length=context.sampleRate*5.5,impulse=context.createBuffer(2,length,context.sampleRate);
 for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);let previous=0;for(let i=0;i<length;i++){previous=previous*.55+(Math.random()*2-1)*.45;const t=i/context.sampleRate;data[i]=previous*Math.exp(-t*.85)*Math.min(t/.035,1)}}
 convolver.buffer=impulse;reverbSend=context.createGain();reverbSend.gain.value=.48;const reverbLevel=context.createGain();reverbLevel.gain.value=.65;reverbSend.connect(convolver);convolver.connect(reverbLevel);reverbLevel.connect(master);
 echoSend=context.createGain();echoSend.gain.value=.2;const delay=context.createDelay(2),feedback=context.createGain(),echoFilter=context.createBiquadFilter();delay.delayTime.value=beat*.75;feedback.gain.value=.3;echoFilter.type='lowpass';echoFilter.frequency.value=1800;echoSend.connect(delay);delay.connect(echoFilter);echoFilter.connect(feedback);feedback.connect(delay);echoFilter.connect(master);
 nextChord=context.currentTime+.12;
}
function envelope(at,attack,hold,release,volume){const gain=context.createGain();gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+attack);gain.gain.setValueAtTime(volume,at+attack+hold);gain.gain.exponentialRampToValueAtTime(.00001,at+attack+hold+release);return gain}
function pad(note,at,duration,pan){
 const gain=envelope(at,2.6,Math.max(0,duration-2.6),4,.035),filter=context.createBiquadFilter(),panner=context.createStereoPanner();filter.type='lowpass';filter.frequency.setValueAtTime(350,at);filter.frequency.linearRampToValueAtTime(1050,at+duration*.65);filter.Q.value=.35;panner.pan.value=pan;gain.connect(filter);filter.connect(panner);panner.connect(music);panner.connect(reverbSend);
 let remaining=2;for(const detune of [-5,5]){const osc=context.createOscillator();osc.type=detune<0?'triangle':'sine';osc.frequency.value=frequency(note);osc.detune.value=detune;osc.connect(gain);osc.start(at);osc.stop(at+duration+4.1);osc.onended=()=>{osc.disconnect();if(--remaining===0){gain.disconnect();filter.disconnect();panner.disconnect()}}}
}
function bass(note,at){const osc=context.createOscillator(),gain=envelope(at,.7,2.5,4,.095);osc.type='sine';osc.frequency.value=frequency(note);osc.connect(gain);gain.connect(music);osc.start(at);osc.stop(at+7.3);osc.onended=()=>{osc.disconnect();gain.disconnect()}}
function key(note,at,strength,pan){
 const panner=context.createStereoPanner();panner.pan.value=pan;panner.connect(music);panner.connect(reverbSend);panner.connect(echoSend);let remaining=3;
 for(const [ratio,level,decay] of [[1,1,3.6],[2,.2,1.8],[3,.035,1]]){const osc=context.createOscillator(),gain=envelope(at,.025,.02,decay,strength*level);osc.type='sine';osc.frequency.value=frequency(note)*ratio;osc.connect(gain);gain.connect(panner);osc.start(at);osc.stop(at+decay+.1);osc.onended=()=>{osc.disconnect();gain.disconnect();if(--remaining===0)panner.disconnect()}}
}
function schedule(){
 if(!enabled||document.hidden||context.state!=='running')return;
 if(nextChord<context.currentTime-.5)nextChord=context.currentTime+.1;
 while(nextChord<context.currentTime+.45){const chord=score[chordIndex%score.length],at=nextChord;chord.chord.forEach((note,i)=>pad(note,at+i*.035,bar,[-.55,.3,-.2,.6][i]));bass(chord.bass,at);chord.melody.forEach((note,i)=>{if(i===3||i===6)return;key(note,at+beat*(i+.28),i===0?.055:.036,Math.sin((chordIndex*8+i)*.7)*.45)});if(chordIndex%2===1)key(chord.melody[2]+12,at+beat*5.5,.01,.65);nextChord+=bar;chordIndex++}
}
async function sync(){
 clearTimeout(fadeTimer);clearInterval(scheduler);
 if(enabled&&!document.hidden){if(!context)build();await context.resume();if(!enabled||document.hidden)return;const now=context.currentTime;master.gain.cancelScheduledValues(now);master.gain.setValueAtTime(master.gain.value,now);master.gain.linearRampToValueAtTime(.38,now+1.8);schedule();scheduler=setInterval(schedule,150)}
 else if(context){const now=context.currentTime;master.gain.cancelScheduledValues(now);master.gain.setValueAtTime(master.gain.value,now);master.gain.linearRampToValueAtTime(0,now+.55);fadeTimer=setTimeout(()=>{if(!enabled||document.hidden)context.suspend().catch(()=>{})},600)}
}
button.onclick=async()=>{enabled=!enabled;paint();try{await sync()}catch(error){enabled=false;paint();label.textContent='Sound unavailable';console.warn('Ambient score could not start',error)}};
document.addEventListener('visibilitychange',()=>{sync().catch(()=>{enabled=false;paint()})});
addEventListener('pagehide',()=>{clearTimeout(fadeTimer);clearInterval(scheduler);if(context)context.suspend().catch(()=>{})});
if(!AudioEngine){button.disabled=true;label.textContent='Sound unavailable';button.setAttribute('aria-label','Ambient sound is unavailable in this browser')}else paint();
})();
