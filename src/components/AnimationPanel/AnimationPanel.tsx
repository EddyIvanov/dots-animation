import React, { useRef, useMemo, useCallback } from 'react';

// @ts-expect-error react-three/fiber should fix in future
import { useFrame } from '@react-three/fiber';
import {
  CanvasTexture,
  Points,
  LineSegments,
  Float32BufferAttribute,
} from 'three';

import {
  BOUNDARY,
  DEFAULT_DOTS_NUMBER,
  DOT_SIZE,
  DOTS_COLOR,
  LINE_UPDATE_INTERVAL,
} from './constants';
import { AnimationBoardProps } from './types';
import {
  getLinePositionsAndColors,
  getRandomVelocitySpeed,
  normalizeVelocity,
} from './utils/';
import { getRandomNumber } from '../../helpers';

const AnimationPanel: React.FC<AnimationBoardProps> = ({
  dotsNumber = DEFAULT_DOTS_NUMBER,
  dotsColor = DOTS_COLOR,
}) => {
  const pointsRef = useRef<Points | null>(null);
  const linesRef = useRef<LineSegments | null>(null);
  const frameCount = useRef(0); // Keep track of frame count for performance optimization

  // Generate random positions within a larger space
  const getRandomPosition = useCallback(
    () => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
    }),
    []
  );

  // Generate random dots with initial positions and targets
  const { positions, targets } = useMemo(() => {
    const positions = new Float32Array(dotsNumber * 3);
    const targets = new Float32Array(dotsNumber * 3);

    for (let i = 0; i < dotsNumber; i++) {
      const pos = getRandomPosition();
      const target = getRandomPosition();

      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      targets[i * 3] = target.x;
      targets[i * 3 + 1] = target.y;
      targets[i * 3 + 2] = target.z;
    }

    return { positions, targets };
  }, [dotsNumber, getRandomPosition]);

  // Store velocities in a ref to prevent unnecessary rerenders
  const velocitiesRef = useRef(new Float32Array(dotsNumber * 3));

  // Initialize velocities
  useMemo(() => {
    for (let i = 0; i < dotsNumber; i++) {
      const dx = targets[i * 3] - positions[i * 3];
      const dy = targets[i * 3 + 1] - positions[i * 3 + 1];
      const dz = targets[i * 3 + 2] - positions[i * 3 + 2];

      const velocitySpeed = getRandomVelocitySpeed();
      const { vx, vy, vz } = normalizeVelocity(dx, dy, dz, velocitySpeed);
      velocitiesRef.current[i * 3] = vx;
      velocitiesRef.current[i * 3 + 1] = vy;
      velocitiesRef.current[i * 3 + 2] = vz;
    }
  }, [dotsNumber, positions, targets]);

  // Create a circular texture for the points, by default is square
  const texture = useMemo(() => {
    const size = DOT_SIZE;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, size, size);
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = dotsColor;
      context.fill();
    }

    const texture = new CanvasTexture(canvas);
    texture.premultiplyAlpha = true; // This helps with transparency issues
    return texture;
  }, []);

  useFrame(({ camera, gl }) => {
    if (!pointsRef.current || !linesRef.current) return;

    frameCount.current += 1;
    const positionsArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    // Update positions with consistent velocity
    for (let i = 0; i < dotsNumber; i++) {
      for (let j = 0; j < 3; j++) {
        const currentIndex = i * 3 + j;
        positionsArray[currentIndex] += velocitiesRef.current[currentIndex];

        // Check if target is reached
        const distanceToTarget = Math.abs(
          targets[currentIndex] - positionsArray[currentIndex]
        );
        if (distanceToTarget < 0.1) {
          // Set new target
          const newTarget = getRandomNumber();
          targets[currentIndex] = newTarget;

          // Calculate new velocity with consistent speed
          const dx = targets[i * 3] - positionsArray[i * 3];
          const dy = targets[i * 3 + 1] - positionsArray[i * 3 + 1];
          const dz = targets[i * 3 + 2] - positionsArray[i * 3 + 2];
          const velocitySpeed = getRandomVelocitySpeed();
          const { vx, vy, vz } = normalizeVelocity(dx, dy, dz, velocitySpeed);

          velocitiesRef.current[i * 3] = vx;
          velocitiesRef.current[i * 3 + 1] = vy;
          velocitiesRef.current[i * 3 + 2] = vz;
        }

        // Boundary check with smooth reversal
        if (Math.abs(positionsArray[currentIndex]) > BOUNDARY) {
          velocitiesRef.current[currentIndex] *= -0.8;
          positionsArray[currentIndex] =
            Math.sign(positionsArray[currentIndex]) * BOUNDARY;
        }
      }
    }

    // Update lines
    if (frameCount.current % LINE_UPDATE_INTERVAL === 0) {
      const { positions: linePositions, colors } = getLinePositionsAndColors({
        camera,
        gl,
        positionsArray,
        dotsNumber,
      });

      // Update line geometry
      const lineGeometry = linesRef.current.geometry;
      if (linePositions.length > 0) {
        lineGeometry.setAttribute(
          'position',
          new Float32BufferAttribute(linePositions, 3)
        );
        lineGeometry.setAttribute(
          'color',
          new Float32BufferAttribute(colors, 3)
        );
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.attributes.color.needsUpdate = true;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {/** @ts-expect-error react-three/fiber should fix in future version */}
      <points ref={pointsRef}>
        {/** @ts-expect-error react-three/fiber should fix in future version */}
        <bufferGeometry>
          {/** @ts-expect-error react-three/fiber should fix in future version */}
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            itemSize={3}
            array={positions}
          />
          {/** @ts-expect-error react-three/fiber should fix in future version */}
        </bufferGeometry>
        {/** @ts-expect-error react-three/fiber should fix in future version */}
        <pointsMaterial
          map={texture}
          size={0.2}
          sizeAttenuation
          transparent
          depthWrite={false}
        />
        {/** @ts-expect-error react-three/fiber should fix in future version */}
      </points>
      {/** @ts-expect-error react-three/fiber should fix in future version */}
      <lineSegments ref={linesRef}>
        {/** @ts-expect-error react-three/fiber should fix in future version */}
        <bufferGeometry />
        {/** @ts-expect-error react-three/fiber should fix in future version */}
        <lineBasicMaterial vertexColors depthWrite={false} />
        {/** @ts-expect-error react-three/fiber should fix in future version */}
      </lineSegments>
    </>
  );
};

export default AnimationPanel;
