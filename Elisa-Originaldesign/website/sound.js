'use strict';
// Original instrumental, not sourced from Spotify. Browser playback needs a user gesture.
const ElisaSound=(()=>{
 const song=new Audio('seit-diesem-tag.mp3');song.loop=true;song.preload='auto';song.volume=.46;
 const clickAudio=new Audio('klick.wav');clickAudio.preload='auto';clickAudio.volume=.66;
 let enabled=true,started=false,context;
 try{enabled=localStorage.getItem('elisa-sound')!=='off'}catch{}
 function sync(){const b=document.getElementById('sound-toggle');if(b){b.textContent=enabled?'♫ Ton an':'♪ Ton aus';b.setAttribute('aria-pressed',String(enabled));b.setAttribute('aria-label',enabled?'Musik und Klicktöne ausschalten':'Musik und Klicktöne einschalten');}}
 function start(){if(!enabled)return; song.play().then(()=>{started=true}).catch(()=>{});}
 function click(){if(!enabled)return;
  try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error();context=context||new AC();context.resume().catch(()=>{});const t=context.currentTime;for(const [f,a] of [[1046.5,.065],[1568,.025]]){const osc=context.createOscillator(),g=context.createGain();osc.type='sine';osc.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(a,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+.15);osc.connect(g).connect(context.destination);osc.start(t);osc.stop(t+.17);}}
  catch{clickAudio.currentTime=0;clickAudio.play().catch(()=>{})}
 }
 function toggle(){enabled=!enabled;try{localStorage.setItem('elisa-sound',enabled?'on':'off')}catch{};if(enabled){click();start()}else song.pause();sync()}
 function pauseForSpotify(){song.pause();enabled=false;sync();}
 document.addEventListener('click',e=>{if(!e.isTrusted)return; if(!e.target.closest('#sound-toggle')){if(enabled&&song.paused&&!e.target.closest('.play'))start();if(e.target.closest('button,a.play'))click();}},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)song.pause();else if(enabled&&started)start()});
 return {toggle,sync,pauseForSpotify};
})();
