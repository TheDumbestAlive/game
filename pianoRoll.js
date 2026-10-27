const audioContext = new AudioContext();
const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
const startingFreq = 32.7;
const startingOctave = 1;
const r2 = Math.pow(2, 1 / 12);
function getFreq (note) {
    note = note.toLowerCase();
    note = note.split('');
    let pitch = note.filter(function (x) {
        return notes.includes(x);
    })[0];
    let octave = note.filter(function (x) {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(x));
    })[0];
    if(!octave || !pitch) {
        return;
    }
    let isSharp = Number(note.includes('#'));
        
    pitch = notes.indexOf(pitch);
    octave = Number(octave) - startingOctave;
        
    let semitones = pitch + (12 * octave) + isSharp;
        
    return startingFreq * pow(r2, semitones);
}

function playNote (note, instrument, gain) {
    if(audioContext.state === 'suspended') {
        audioContext.resume();
    }
    try{
        let freq = getFreq(note)
        if(!['sine', 'sawtooth', 'square', 'triangle'].includes(instrument)) return
        let osc = audioContext.createOscillator();
        let fade = audioContext.createGain();
        fade.gain.value = 1;
        
        osc.frequency.value = freq;

        osc.type = instrument;
        osc.connect(fade)


        fade.connect(audioContext.destination)
        osc.start(0);
        osc.stop(audioContext.currentTime + 1.5)
        fade.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
    }
    catch(err) {
        alert(2 + err)
    }
}

class PianoRoll {
    constructor (tracks) {
        //[time, note]
        this.masterTrack = [];
        this.duration = 0;
        for(let i = 0; i < tracks.length; i++) {
            for(let k = 0; k < tracks[i].length; k++) {
                if(tracks[i][k].time > this.duration) {
                    this.duration = tracks[i][k].time;
                }
                this.masterTrack.push([tracks[i][k].time, tracks[i][k].note]);
            }
        }
        this.state = 'stoppped'
        this.startTime = 0;
        this.notes = this.masterTrack.length;
        this.volEqualize = null;
        this.normVol = 0.5;
        this.voices = 0;
    }
    start () {
        if(this.state !== 'stopped') return
        this.state = 'ready'
        this.startTime = audioContext.currentTime;
        this.roll = structuredClone(this.masterTrack)
        this.volEqualize = audioContext.createGain();
        this.volEqualize.gain.value = 1;
        this.volEqualize.connect(audioContext.destination)
        this.voices = 0;
    }
    play (instrument) {
        if(this.state === 'ready') this.state = 'running'
        if(this.state !== 'running') return
        for(let i = this.roll.length - 1; i >= 0; i--) {
            let time = this.roll[i][0];
            let note = this.roll[i][1];
            if(time <= audioContext.currentTime - this.startTime) {
                this.voices ++;
                this.volEqualize.gain.value = this.normVol / Math.sqrt(this.voices);
                //#region
                    let freq = getFreq(note)
                    if(!['sine', 'sawtooth', 'square', 'triangle'].includes(instrument)) instrument = 'sine'
                    let osc = audioContext.createOscillator();
                    let fade = audioContext.createGain();
                    fade.gain.value = 1;
                    osc.frequency.value = freq;
                    osc.type = instrument;
                    osc.connect(fade)
                    fade.connect(this.volEqualize)
                    osc.start(0);
                    osc.stop(audioContext.currentTime + 1.5)
                    osc.onended = () => {
                        this.voices --;
                        this.volEqualize.gain.value = this.normVol / Math.sqrt(this.voices);
                    }
                    fade.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
                //#endregion
                this.roll.splice(i, 1)
            }
        }

        
    }
    stop () {
        this.state = 'stopped'
    }
}
