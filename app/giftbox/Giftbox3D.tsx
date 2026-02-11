"use client"
import Particles from './Particles';
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

const oliveImages = ["box-1.jpeg", "box-5.jpg"];
const almondImages = ["box-2.jpeg", "box-3.jpeg"];

export default function Giftbox3D() {
  const [opened, setOpened] = useState<string|null>(null);
  const [slide, setSlide] = useState<number>(0);
  const [randomMsg, setRandomMsg] = useState<string>("");

  const oliveBoxRef = useRef<HTMLDivElement>(null);
  const [oliveBoxHeight, setOliveBoxHeight] = useState<number>(0);

  useEffect(() => {
    if (opened === 'olive' && oliveBoxRef.current) {
      setTimeout(() => {
        setOliveBoxHeight(oliveBoxRef.current?.offsetHeight || 0);
      }, 400);
    } else {
      setOliveBoxHeight(0);
    }
  }, [opened]);

  const oliveMsgs = [
    "May your olive oil bring joy and flavor to your table!",
    "A drop of Joyland olive oil, a world of taste.",
    "Nature’s gold, pressed just for you.",
    "Enjoy the harvest, every year is a surprise!"
  ];
  const almondMsgs = [
    "Almonds: the taste of spring in every bite!",
    "A crunchy surprise from Joyland’s valley.",
    "Nature’s creativity, wrapped in a shell.",
    "May your giftbox bring smiles and inspiration!"
  ];

  const handleOpen = (type: string) => {
    setOpened(type);
    setSlide(0);
    const msgs = type === "olive" ? oliveMsgs : almondMsgs;
    setRandomMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setTimeout(() => {
      const ref = type === "olive" ? document.getElementById('giftbox-card-olive') : document.getElementById('giftbox-card-almond');
      if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 350);
  };

  const handleClose = () => setOpened(null);

  const images = opened === "olive" ? oliveImages : almondImages;
  const descriptions = {
    olive: `The Olive Giftbox includes premium cold-pressed olive oil (500ml) and a surprise from the olive harvest. Each year brings a unique flavor and experience, reflecting the land's abundance.`,
    almond: `The Almond Giftbox includes fresh almonds in shell (250ml) and a creative surprise from nature. Enjoy the taste of spring and the valley's bloom, plus a handcrafted treat from Joyland.`
  };

  return (
    <div className={`flex flex-col md:flex-row justify-center items-center mb-16 md:space-x-12`}>
      {/* Caixa Olive */}
      <div
        ref={oliveBoxRef}
        className={`relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] perspective transition-all duration-500 ${opened && opened !== 'olive' ? 'hidden sm:block' : ''} mb-8 md:mb-0`}
        style={opened === 'olive' ? { marginBottom: oliveBoxHeight ? oliveBoxHeight - 260 + 32 : 480 } : {}}
      >
        <div className={`giftbox-3d shadow-xl bg-gradient-to-br from-sage-100 via-white to-sage-200 animate-pulse-on-hover ${opened === "olive" ? "opened" : ""}`} onClick={() => handleOpen("olive")}> 
          <div className="giftbox-lid" />
          <div className="giftbox-body" />
          <span className="giftbox-label">Olive Giftbox</span>
        </div>
        {opened === "olive" && (
          <div className="relative flex flex-col items-center mb-12" style={{minHeight: 420}}>
            <Particles type="olive" active={true} />
            <div id="giftbox-card-olive" className="giftbox-card animate-fade-in mb-4 bg-white/90 border-2 border-sage-400 rounded-xl shadow-xl p-6 w-[260px] md:w-[340px] text-center backdrop-blur-lg" style={{zIndex: 50, position: 'relative'}}>
              <div className="text-2xl font-serif text-sage-700 mb-2">Olive Giftbox</div>
              <div className="text-sage-700 text-base leading-relaxed mb-2">{descriptions.olive}</div>
              <div className="mt-2 text-green-700 font-bold text-lg animate-fade-in-card">{randomMsg}</div>
            </div>
            <div className="giftbox-slider flex flex-col items-center justify-center bg-white/90 backdrop-blur-lg rounded-2xl border-2 border-sage-300 shadow-2xl z-10 animate-fade-in">
              <button className="absolute top-3 right-3 text-sage-700 text-2xl font-bold hover:text-sage-900 transition-colors" onClick={handleClose}>&times;</button>
              <div className="w-[220px] h-[220px] md:w-[300px] md:h-[300px] flex items-center justify-center">
                <Image
                  src={`/gift/${images[slide]}`}
                  alt={`Olive Giftbox ${slide+1}`}
                  width={300}
                  height={300}
                  className="rounded-xl object-contain shadow-lg bg-white"
                  priority
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button disabled={slide===0} onClick={()=>setSlide(slide-1)} className="bg-sage-600 text-white px-3 py-1 rounded-lg disabled:opacity-50 shadow-md hover:bg-sage-700 transition-colors">◀</button>
                <button disabled={slide===images.length-1} onClick={()=>setSlide(slide+1)} className="bg-sage-600 text-white px-3 py-1 rounded-lg disabled:opacity-50 shadow-md hover:bg-sage-700 transition-colors">▶</button>
              </div>
              <div className="mt-2 text-sage-700 font-semibold text-lg tracking-wide drop-shadow">{`Olive Giftbox ${slide+1}`}</div>
            </div>
          </div>
        )}
      </div>
      {/* Caixa Almond */}
      <div className={`relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] perspective ${opened && opened !== 'almond' ? 'hidden sm:block' : ''} mb-8 md:mb-0`}>
        <div className={`giftbox-3d almond shadow-xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 animate-pulse-on-hover ${opened === "almond" ? "opened" : ""}`} onClick={() => handleOpen("almond")}> 
          <div className="giftbox-lid" />
          <div className="giftbox-body" />
          <span className="giftbox-label">Almond Giftbox</span>
        </div>
        {opened === "almond" && (
          <div className="relative flex flex-col items-center mb-4" style={{minHeight: 420}}>
            <Particles type="almond" active={true} />
            <div id="giftbox-card-almond" className="giftbox-card animate-fade-in mb-4 bg-white/90 border-2 border-yellow-400 rounded-xl shadow-xl p-6 w-[260px] md:w-[340px] text-center backdrop-blur-lg" style={{zIndex: 50, position: 'relative'}}>
              <div className="text-2xl font-serif text-yellow-700 mb-2">Almond Giftbox</div>
              <div className="text-yellow-700 text-base leading-relaxed mb-2">{descriptions.almond}</div>
              <div className="mt-2 text-amber-700 font-bold text-lg animate-fade-in-card">{randomMsg}</div>
            </div>
            <div className="giftbox-slider flex flex-col items-center justify-center bg-white/90 backdrop-blur-lg rounded-2xl border-2 border-yellow-200 shadow-2xl z-10 animate-fade-in">
              <button className="absolute top-3 right-3 text-yellow-700 text-2xl font-bold hover:text-yellow-900 transition-colors" onClick={handleClose}>&times;</button>
              <div className="w-[220px] h-[220px] md:w-[300px] md:h-[300px] flex items-center justify-center">
                <Image
                  src={`/gift/${images[slide]}`}
                  alt={`Almond Giftbox ${slide+1}`}
                  width={300}
                  height={300}
                  className="rounded-xl object-contain shadow-lg bg-white"
                  priority
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button disabled={slide===0} onClick={()=>setSlide(slide-1)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg disabled:opacity-50 shadow-md hover:bg-yellow-600 transition-colors">◀</button>
                <button disabled={slide===images.length-1} onClick={()=>setSlide(slide+1)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg disabled:opacity-50 shadow-md hover:bg-yellow-600 transition-colors">▶</button>
              </div>
              <div className="mt-2 text-yellow-700 font-semibold text-lg tracking-wide drop-shadow">{`Almond Giftbox ${slide+1}`}</div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .perspective { perspective: 1200px; }
        .giftbox-3d {
          width: 100%; height: 100%; position: relative; cursor: pointer;
          transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(.68,-.55,.27,1.55);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
        .animate-pulse-on-hover:hover {
          animation: pulse 1.2s infinite alternate;
        }
        @keyframes pulse {
          0% { box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 0 0 0 #a7f3d0; }
          100% { box-shadow: 0 8px 32px rgba(0,0,0,0.13), 0 0 24px 8px #a7f3d0; }
        }
        .giftbox-3d .giftbox-lid {
          position: absolute; top: 0; left: 0; width: 100%; height: 40%; background: #e5e7eb; border-radius: 16px 16px 0 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          transform: translateY(0) rotateX(0deg); transition: transform 0.8s cubic-bezier(.68,-.55,.27,1.55);
          filter: brightness(1.05) drop-shadow(0 2px 8px #a7f3d0);
        }
        .giftbox-3d.opened .giftbox-lid {
          transform: translateY(-60%) rotateX(60deg);
        }
        .giftbox-3d .giftbox-body {
          position: absolute; bottom: 0; left: 0; width: 100%; height: 60%; background: #fff; border-radius: 0 0 16px 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          filter: brightness(1.02);
        }
        .giftbox-3d .giftbox-label {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); font-size: 1.2rem; font-weight: 600; color: #6b7280;
          text-shadow: 0 2px 8px #fff;
        }
        .giftbox-3d.almond .giftbox-lid { background: #fef3c7; filter: brightness(1.08) drop-shadow(0 2px 8px #fde68a); }
        .giftbox-3d.almond .giftbox-body { background: #fffbe6; filter: brightness(1.04); }
        .giftbox-3d.almond .giftbox-label { color: #b45309; }
        .giftbox-slider { animation: fade-in 0.6s; }
        .giftbox-card { animation: fade-in-card 0.7s; }
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes fade-in-card { from { opacity: 0; transform: translateY(-40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
