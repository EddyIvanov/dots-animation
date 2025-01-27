// @ts-expect-error react-three/fiber should fix in future
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
      <AnimationPanel dotsNumber={200} />
    </Canvas>
  );
};

export default CanvasBoard;
