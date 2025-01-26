import { Canvas } from '@react-three/fiber';

import AnimationPanel from '../AnimationPanel';

const CanvasBoard: React.FC = () => {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <AnimationPanel dotsNumber={100} />
    </Canvas>
  );
};

export default CanvasBoard;
