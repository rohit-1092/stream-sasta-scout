import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

const VRCinema = ({ videoId, onClose, movieTitle }) => {
  return (
    <div className="fixed inset-0 w-full h-full z-[3000] bg-black overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={<Html center><div className="text-white animate-pulse text-xl font-bold">Connecting to Screen...</div></Html>}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
          
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.8} 
            minDistance={5} 
            maxDistance={12} 
            rotateSpeed={0.6}
          />

          <ambientLight intensity={0.4} />
          <spotLight position={[0, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />

          {/* Wall */}
          <mesh position={[0, 2, -6]}>
            <boxGeometry args={[25, 15, 0.5]} />
            <meshStandardMaterial color="#0a0a0a" />
          </mesh>

          {/* Improved Cinema Screen with better visibility */}
          <mesh position={[0, 2, -5.5]}> {/* Thoda sa diwaar se aage kiya hai */}
            <planeGeometry args={[14, 7.8]} />
            <meshStandardMaterial color="black" /> {/* Background mesh */}
            <Html 
              transform 
              occlude="blending" 
              distanceFactor={8} // Isse mobile par video bada aur clear dikhega
              position={[0, 0, 0.05]}
              style={{
                width: '1280px',
                height: '720px',
                pointerEvents: 'auto'
              }}
            >
              <div className="w-full h-full bg-black border-[4px] border-[#222] shadow-[0_0_50px_rgba(56,189,248,0.2)]">
                <iframe
                  width="100%" 
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&modestbranding=1&enablejsapi=1`}
                  title={movieTitle}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Html>
          </mesh>

          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.6} />
          </mesh>

          {/* Seats */}
          {[ -6, -3, 0, 3, 6 ].map((x) => (
            <mesh key={x} position={[x, -3.5, 5]} castShadow>
              <boxGeometry args={[1.8, 1.2, 1.2]} />
              <meshStandardMaterial color="#3d0a0a" />
            </mesh>
          ))}

          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Buttons & Title */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none w-full px-4 z-[3005]">
        <h2 className="text-white text-xl md:text-3xl font-bold drop-shadow-2xl mb-1">{movieTitle}</h2>
        <p className="text-[#38bdf8] text-xs md:text-sm font-medium">3D Immersive Mode Active</p>
      </div>

      <button 
        onClick={onClose}
        className="absolute top-6 right-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-2xl z-[3010] cursor-pointer pointer-events-auto"
      >
        Exit ✖
      </button>
    </div>
  );
};

export default VRCinema;