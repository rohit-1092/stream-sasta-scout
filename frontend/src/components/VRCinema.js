import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

const VRCinema = ({ videoId, onClose, movieTitle }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000, background: '#000' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2} 
            minDistance={5} 
            maxDistance={15} 
          />

          {/* Hall ki Lights */}
          <ambientLight intensity={0.2} />
          <spotLight position={[0, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          {/* 3D Hall: Diwaarein (Walls) */}
          <mesh position={[0, 2, -5]}>
            <boxGeometry args={[20, 10, 0.5]} />
            <meshStandardMaterial color="#111" />
          </mesh>

          {/* Cinema Screen (The Main Focus) */}
          <mesh position={[0, 2, -4.7]}>
            <planeGeometry args={[12, 6.75]} />
            <Html transform occlude distanceFactor={10} position={[0, 0, 0.1]}>
              <div style={{ width: '1200px', height: '675px', background: '#000', border: '5px solid #222' }}>
                <iframe
                  width="100%" height="100%"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=0`}
                  title={movieTitle}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                ></iframe>
              </div>
            </Html>
          </mesh>

          {/* Floor with Realistic Reflection */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.5} />
          </mesh>

          {/* Virtual Seats (Hum dabbo ka use karenge seats dikhane ke liye) */}
          {[ -4, -2, 0, 2, 4 ].map((x) => (
            <mesh key={x} position={[x, -2.5, 5]} castShadow>
              <boxGeometry args={[1.5, 1, 1]} />
              <meshStandardMaterial color="#441111" />
            </mesh>
          ))}

          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* UI Elements */}
      <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: 'white', pointerEvents: 'none' }}>
        <h2 style={{ margin: 0 }}>{movieTitle}</h2>
        <p style={{ opacity: 0.7 }}>Screen ko rotate karke hall dekhein</p>
      </div>

      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '20px', right: '20px', padding: '12px 30px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Cinema se Bahar Niklein
      </button>
    </div>
  );
};

export default VRCinema;