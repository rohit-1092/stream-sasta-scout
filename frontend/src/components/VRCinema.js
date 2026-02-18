import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

const VRCinema = ({ videoId, onClose, movieTitle }) => {
  return (
    <div className="fixed inset-0 w-full h-full z-[3000] bg-black overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={<Html center><div className="text-white animate-pulse text-xl">Entering Cinema Hall...</div></Html>}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
          
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.8} 
            minDistance={6} 
            maxDistance={14} 
            rotateSpeed={0.5}
          />

          <ambientLight intensity={0.3} />
          <spotLight position={[0, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />

          {/* 3D Wall */}
          <mesh position={[0, 2, -6]}>
            <boxGeometry args={[25, 15, 0.5]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>

          {/* Responsive Cinema Screen */}
          <mesh position={[0, 2, -5.7]}>
            <planeGeometry args={[14, 7.8]} />
            <Html 
              transform 
              occlude 
              distanceFactor={window.innerWidth < 768 ? 12 : 10} 
              position={[0, 0, 0.1]}
            >
              <div className="bg-black border-[6px] border-[#1f1f1f] shadow-2xl overflow-hidden" 
                   style={{ width: '1280px', height: '720px' }}>
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&modestbranding=1`}
                  title={movieTitle}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                ></iframe>
              </div>
            </Html>
          </mesh>

          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#030303" roughness={0.05} metalness={0.8} />
          </mesh>

          {/* Virtual Seats */}
          {[ -6, -3, 0, 3, 6 ].map((x) => (
            <mesh key={x} position={[x, -3.5, 6]} castShadow>
              <boxGeometry args={[1.8, 1.2, 1.2]} />
              <meshStandardMaterial color="#2d0a0a" roughness={0.8} />
            </mesh>
          ))}

          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none w-full px-4">
        <h2 className="text-white text-xl md:text-3xl font-bold drop-shadow-lg mb-1">{movieTitle}</h2>
        <p className="text-gray-400 text-sm md:text-base italic">Drag screen to look around the hall</p>
      </div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-xl transition-all z-[3001] active:scale-95"
      >
        Exit Cinema ✖
      </button>
    </div>
  );
};

export default VRCinema;