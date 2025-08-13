import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ScrollableBackgroundCircles({ 
  scrollY = 0,
  glassContainers = [] // Array of { id, x, y, width, height, borderRadius }
}) {
  const [circles, setCircles] = useState([]);

  // Generate initial circles
  useEffect(() => {
    generateCircles();
  }, []);

  const generateCircles = () => {
    const newCircles = [];
    const colors = [
      'rgba(102, 126, 234, 0.2)',
      'rgba(118, 75, 162, 0.2)',
      'rgba(102, 126, 234, 0.15)',
      'rgba(118, 75, 162, 0.18)',
      'rgba(102, 126, 234, 0.18)',
      'rgba(118, 75, 162, 0.15)',
    ];

    // Generate 12-16 circles
    const numCircles = Math.floor(Math.random() * 5) + 12;
    console.log('Generating', numCircles, 'circles');
    
    for (let i = 0; i < numCircles; i++) {
      const size = Math.floor(Math.random() * 150) + 50; // 50-200px
      const top = Math.random() * (height * 4); // From 0 to 4x screen height
      const left = Math.random() * width;
      const circle = {
        id: i,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        left,
        top,
        speed: Math.random() * 0.5 + 0.1, // Scroll speed multiplier
      };
      newCircles.push(circle);
      console.log(`Circle ${i}: size=${size}, top=${top}, left=${left}, color=${circle.color}`);
    }
    
    setCircles(newCircles);
    console.log('Circles generated:', newCircles.length);
  };

  // Check if a circle is behind a glass container and get distortion level
  const getGlassDistortion = (circle, adjustedTop) => {
    // Check against default glass containers
    const searchBarArea = {
      top: 100 - scrollY,
      left: 20,
      right: width - 20,
      height: 60,
    };
    
    const profileArea = {
      top: 200 - scrollY,
      left: 20,
      right: width - 20,
      height: 120,
    };
    
    // Publish and Sign Out buttons area
    const buttonsArea = {
      top: 350 - scrollY,
      left: 20,
      right: width - 20,
      height: 60,
    };
    
    // Feed items area (approximate position where feed images appear)
    const feedArea = {
      top: 450 - scrollY,
      left: 20,
      right: width - 20,
      height: 600, // Extended height to cover multiple feed items
    };
    
    let distortionLevel = 0;
    let isBehindGlass = false;
    
    // Check if circle intersects with search bar
    if (adjustedTop + circle.size > searchBarArea.top && 
        adjustedTop < searchBarArea.top + searchBarArea.height &&
        circle.left + circle.size > searchBarArea.left && 
        circle.left < searchBarArea.right) {
      isBehindGlass = true;
      // Calculate how much of the circle is behind glass
      const overlapTop = Math.max(adjustedTop, searchBarArea.top);
      const overlapBottom = Math.min(adjustedTop + circle.size, searchBarArea.top + searchBarArea.height);
      const overlapHeight = overlapBottom - overlapTop;
      distortionLevel = Math.max(distortionLevel, Math.min(overlapHeight / circle.size, 1));
    }
    
    // Check if circle intersects with profile section
    if (adjustedTop + circle.size > profileArea.top && 
        adjustedTop < profileArea.top + profileArea.height &&
        circle.left + circle.size > profileArea.left && 
        circle.left < profileArea.right) {
      isBehindGlass = true;
      // Calculate how much of the circle is behind glass
      const overlapTop = Math.max(adjustedTop, profileArea.top);
      const overlapBottom = Math.min(adjustedTop + circle.size, profileArea.top + profileArea.height);
      const overlapHeight = overlapBottom - overlapTop;
      distortionLevel = Math.max(distortionLevel, Math.min(overlapHeight / circle.size, 1));
    }
    
    // Check if circle intersects with publish/sign out buttons
    if (adjustedTop + circle.size > buttonsArea.top && 
        adjustedTop < buttonsArea.top + buttonsArea.height &&
        circle.left + circle.size > buttonsArea.left && 
        circle.left < buttonsArea.right) {
      isBehindGlass = true;
      // Calculate how much of the circle is behind glass
      const overlapTop = Math.max(adjustedTop, buttonsArea.top);
      const overlapBottom = Math.min(adjustedTop + circle.size, buttonsArea.top + buttonsArea.height);
      const overlapHeight = overlapBottom - overlapTop;
      distortionLevel = Math.max(distortionLevel, Math.min(overlapHeight / circle.size, 1));
    }
    
    // Check if circle intersects with feed items
    if (adjustedTop + circle.size > feedArea.top && 
        adjustedTop < feedArea.top + feedArea.height &&
        circle.left + circle.size > feedArea.left && 
        circle.left < feedArea.right) {
      isBehindGlass = true;
      // Calculate how much of the circle is behind glass
      const overlapTop = Math.max(adjustedTop, feedArea.top);
      const overlapBottom = Math.min(adjustedTop + circle.size, feedArea.top + feedArea.height);
      const overlapHeight = overlapBottom - overlapTop;
      distortionLevel = Math.max(distortionLevel, Math.min(overlapHeight / circle.size, 1));
    }
    
    return { isBehindGlass, distortionLevel };
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
      {/* Background circles */}
      {circles.map((circle) => {
        const adjustedTop = circle.top - (scrollY * circle.speed);
        const { isBehindGlass, distortionLevel } = getGlassDistortion(circle, adjustedTop);
        
        // Enhanced distortion effects
        const opacity = isBehindGlass ? 0.2 + (distortionLevel * 0.3) : 1;
        const scale = isBehindGlass ? 0.8 + (distortionLevel * 0.4) : 1;
        
        // Color shift when behind glass
        const colorShift = isBehindGlass ? {
          backgroundColor: circle.color.replace(')', `, ${0.7 + distortionLevel * 0.3})`).replace('rgba', 'rgba'),
        } : { backgroundColor: circle.color };
        
        return (
          <View
            key={circle.id}
            style={{
              position: 'absolute',
              width: circle.size,
              height: circle.size,
              borderRadius: circle.size / 2,
              left: circle.left,
              top: adjustedTop,
              zIndex: 0,
              opacity,
              transform: [{ scale }],
              ...colorShift,
            }}
          />
        );
      })}
    </View>
  );
} 