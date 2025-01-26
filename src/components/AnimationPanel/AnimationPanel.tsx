import React, { useRef, useMemo } from 'react';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import {
  DEFAULT_DOTS_NUMBER,
  DOT_SIZE,
  DOTS_COLOR,
  DOTS_DISTANCE,
  TRANSITION_SPEED,
} from './constants';
import { AnimationBoardProps } from './types';
import { getRandomNumber } from '../../helpers';
import {
  getDistanceBetweenPoints,
  getOpacityFromDistance,
  getScreenPosition,
} from './utils/';

const AnimationPanel: React.FC<AnimationBoardProps> = ({
  dotsNumber = DEFAULT_DOTS_NUMBER,
  dotsColor = DOTS_COLOR,
  transitionSpeed = TRANSITION_SPEED,
}) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);

  // Generate random dots with initial positions and targets
  const { positions, targets } = useMemo(() => {
    const positions = new Float32Array(dotsNumber * 3); // Initial positions
    const targets = new Float32Array(dotsNumber * 3); // Target positions

    for (let i = 0; i < dotsNumber; i++) {
      positions[i * 3 + 0] = getRandomNumber(); // x-coordinate
      positions[i * 3 + 1] = getRandomNumber(); // y-coordinate
      positions[i * 3 + 2] = getRandomNumber(); // z-coordinate

      targets[i * 3 + 0] = getRandomNumber(); // Initial random target x-coordinate
      targets[i * 3 + 1] = getRandomNumber(); // Initial random target y-coordinate
      targets[i * 3 + 2] = getRandomNumber(); // Initial random target z-coordinate
    }

    return { positions, targets };
  }, [dotsNumber]);

  // Create a circular texture for the points, by default is square
  const texture = useMemo(() => {
    const size = DOT_SIZE;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = dotsColor;
      context.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(({ camera, gl }) => {
    if (pointsRef.current && linesRef.current) {
      const positionsArray = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      const linePositions: number[] = [];
      const colors: number[] = [];

      for (let i = 0; i < dotsNumber; i++) {
        for (let j = 0; j < 3; j++) {
          const currentIndex = i * 3 + j;

          // Smoothly interpolate current position toward the target
          positionsArray[currentIndex] +=
            (targets[currentIndex] - positionsArray[currentIndex]) *
            transitionSpeed;

          // If the target is nearly reached, set a new random target
          if (
            Math.abs(targets[currentIndex] - positionsArray[currentIndex]) < 0.3
          ) {
            targets[currentIndex] = TRANSITION_SPEED;
          }
        }
      }

      // Compute lines between points within 100px screen-space radius
      for (let i = 0; i < dotsNumber; i++) {
        const pos1 = new THREE.Vector3(
          positionsArray[i * 3 + 0],
          positionsArray[i * 3 + 1],
          positionsArray[i * 3 + 2]
        );
        const screenPos1 = getScreenPosition(pos1, camera, gl.domElement);

        for (let j = i + 1; j < dotsNumber; j++) {
          const pos2 = new THREE.Vector3(
            positionsArray[j * 3 + 0],
            positionsArray[j * 3 + 1],
            positionsArray[j * 3 + 2]
          );
          const screenPos2 = getScreenPosition(pos2, camera, gl.domElement);

          // Check if the two points are within the 100px screen radius
          const distance = getDistanceBetweenPoints(screenPos1, screenPos2);
          if (distance < DOTS_DISTANCE) {
            linePositions.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
            const alpha = getOpacityFromDistance(distance);
            colors.push(alpha, alpha, alpha, alpha, alpha, alpha);
          }
        }
      }

      // Update positions and colors of the lines
      const lineGeometry = linesRef.current.geometry as THREE.BufferGeometry;
      lineGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      lineGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3)
      );
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            itemSize={3}
            array={positions}
          />
        </bufferGeometry>
        <pointsMaterial
          map={texture}
          size={0.2}
          sizeAttenuation
          transparent
          alphaTest={0.5}
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors />
      </lineSegments>
    </>
  );
};

export default AnimationPanel;
