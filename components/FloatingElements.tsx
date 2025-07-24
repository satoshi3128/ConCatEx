'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFloatingElements } from './FloatingElementsProvider';

interface FloatingElement {
  id: string;
  type: 'sphere' | 'cube' | 'cylinder';
  x: number; // 位置 (%)
  y: number; // 位置 (%)
  size: number; // サイズ (px)
  animationDelay: number; // アニメーション遅延 (秒)
  animationDuration: number; // アニメーション時間 (秒)
  animationType: 'float1' | 'float2' | 'float3';
}

interface FloatingElementsProps {
  isVisible?: boolean;
  updateInterval?: number; // 更新間隔 (ミリ秒、デフォルト30秒)
  maxElements?: number; // 最大要素数 (デフォルト6)
}

export default function FloatingElements({ 
  updateInterval = 60000,
  maxElements = 4 
}: Omit<FloatingElementsProps, 'isVisible'>) {
  const { isFloatingEnabled } = useFloatingElements();
  const [elements, setElements] = useState<FloatingElement[]>([]);

  // ランダム要素生成関数
  const generateRandomElement = (id: string): FloatingElement => {
    const types: FloatingElement['type'][] = ['sphere', 'cube', 'cylinder'];
    const animations: FloatingElement['animationType'][] = ['float1', 'float2', 'float3'];
    
    return {
      id,
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * 80 + 10, // 10-90%の範囲
      y: Math.random() * 80 + 10, // 10-90%の範囲
      size: Math.floor(Math.random() * 50) + 30, // 30-80px
      animationDelay: Math.random() * 6, // 0-6秒
      animationDuration: Math.random() * 4 + 6, // 6-10秒
      animationType: animations[Math.floor(Math.random() * animations.length)]
    };
  };

  // 初期要素生成
  const generateElements = useCallback(() => {
    const newElements: FloatingElement[] = [];
    for (let i = 0; i < maxElements; i++) {
      newElements.push(generateRandomElement(`element-${i}-${Date.now()}`));
    }
    setElements(newElements);
  }, [maxElements]);

  // 個別要素の更新（位置・サイズ・アニメーション変更）
  const updateElement = useCallback((elementId: string) => {
    setElements(prev => prev.map(element => 
      element.id === elementId 
        ? { ...generateRandomElement(element.id), id: element.id }
        : element
    ));
  }, []);

  // 全要素リランダム化
  const regenerateAllElements = useCallback(() => {
    generateElements();
  }, [generateElements]);

  // 初期化
  useEffect(() => {
    generateElements();
  }, [generateElements]);

  // 定期更新（全要素再生成）
  useEffect(() => {
    if (updateInterval <= 0) return;

    const interval = setInterval(() => {
      regenerateAllElements();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, regenerateAllElements]);

  // 個別要素の定期部分更新（より自然な動き）
  useEffect(() => {
    if (!isFloatingEnabled) return;

    const intervals: NodeJS.Timeout[] = [];
    
    elements.forEach((element) => {
      // 各要素を異なるタイミングで更新（10-20秒間隔）
      const randomInterval = Math.random() * 10000 + 10000; // 10-20秒
      
      const interval = setInterval(() => {
        updateElement(element.id);
      }, randomInterval);
      
      intervals.push(interval);
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [elements, isFloatingEnabled, updateElement]);

  if (!isFloatingEnabled) return null;

  return (
    <>
      {elements.map((element) => (
        <div
          key={element.id}
          className="floating-element-dynamic"
          style={{
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            pointerEvents: 'none',
            zIndex: 1,
            animationDelay: `${element.animationDelay}s`,
            animationDuration: `${element.animationDuration}s`,
            animationName: element.animationType,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            perspective: '1000px',
            transform: 'translate(-50%, -50%)', // 中央基準配置
          }}
        >
          {element.type === 'sphere' && (
            <div
              className="floating-sphere-dynamic"
              style={{
                width: `${element.size}px`,
                height: `${element.size}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.1))',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
                transformStyle: 'preserve-3d',
              }}
            />
          )}
          
          {element.type === 'cube' && (
            <div
              className="floating-cube-dynamic"
              style={{
                width: `${element.size}px`,
                height: `${element.size}px`,
                transformStyle: 'preserve-3d',
                animation: `rotate3d ${element.animationDuration * 2}s linear infinite, ${element.animationType} ${element.animationDuration}s ease-in-out infinite`,
                animationDelay: `${element.animationDelay}s`,
              }}
            >
              {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
                <div
                  key={face}
                  className={`cube-face-dynamic cube-face-${face}`}
                  style={{
                    position: 'absolute',
                    width: `${element.size}px`,
                    height: `${element.size}px`,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(6px)',
                    transform: getCubeFaceTransform(face, element.size),
                  }}
                />
              ))}
            </div>
          )}
          
          {element.type === 'cylinder' && (
            <div
              className="floating-cylinder-dynamic"
              style={{
                width: `${element.size * 0.7}px`,
                height: `${element.size * 1.5}px`,
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12))',
                borderRadius: `${element.size * 0.35}px`,
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
                animation: `${element.animationType} ${element.animationDuration}s ease-in-out infinite, sway ${element.animationDuration * 0.6}s ease-in-out infinite`,
                animationDelay: `${element.animationDelay}s`,
              }}
            />
          )}
        </div>
      ))}
    </>
  );
}

// 立方体の各面の3D変換を計算
function getCubeFaceTransform(face: string, size: number): string {
  const halfSize = size / 2;
  
  switch (face) {
    case 'front':
      return `translateZ(${halfSize}px)`;
    case 'back':
      return `rotateY(180deg) translateZ(${halfSize}px)`;
    case 'right':
      return `rotateY(90deg) translateZ(${halfSize}px)`;
    case 'left':
      return `rotateY(-90deg) translateZ(${halfSize}px)`;
    case 'top':
      return `rotateX(90deg) translateZ(${halfSize}px)`;
    case 'bottom':
      return `rotateX(-90deg) translateZ(${halfSize}px)`;
    default:
      return '';
  }
}