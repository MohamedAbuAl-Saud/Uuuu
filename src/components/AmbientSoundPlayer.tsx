import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Waves, CloudRain, Wind, Compass } from 'lucide-react';

export default function AmbientSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSound, setActiveSound] = useState<'waves' | 'storm' | 'ship' | 'wind'>('waves');
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(activeSound);
    }
  };

  const startAudio = (type: 'waves' | 'storm' | 'ship' | 'wind') => {
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      // Create pink noise buffer for realistic ocean/wind
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Filter for ocean modulation
      const filter = ctx.createBiquadFilter();
      filter.type = type === 'storm' ? 'bandpass' : 'lowpass';
      filter.frequency.value = type === 'storm' ? 800 : type === 'wind' ? 600 : 350;

      // LFO for wave swelling
      const lfo = ctx.createOscillator();
      lfo.frequency.value = type === 'waves' ? 0.12 : type === 'storm' ? 0.25 : 0.08;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = type === 'waves' ? 250 : 400;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(gain);

      noise.start();
      lfo.start();
      noiseSourceRef.current = noise;
      setIsPlaying(true);
      setActiveSound(type);
    } catch {
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const handleSoundChange = (type: 'waves' | 'storm' | 'ship' | 'wind') => {
    setActiveSound(type);
    if (isPlaying) {
      startAudio(type);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1.5 backdrop-blur-md shadow-lg">
      <button
        onClick={togglePlay}
        className={`p-1.5 rounded-full transition-all ${
          isPlaying ? 'bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/50' : 'text-slate-400 hover:text-white'
        }`}
        title={isPlaying ? 'إيقاف الصوت المحيطي' : 'تشغيل أمواج البحر المحيطية'}
      >
        {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {isPlaying && (
        <div className="flex items-center gap-1.5 animate-fadeIn">
          <button
            onClick={() => handleSoundChange('waves')}
            className={`p-1 rounded-full text-xs transition ${
              activeSound === 'waves' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="أمواج البحر"
          >
            <Waves className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSoundChange('storm')}
            className={`p-1 rounded-full text-xs transition ${
              activeSound === 'storm' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="عاصفة ومطر"
          >
            <CloudRain className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleSoundChange('wind')}
            className={`p-1 rounded-full text-xs transition ${
              activeSound === 'wind' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="رياح البحر"
          >
            <Wind className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-12 h-1 accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
