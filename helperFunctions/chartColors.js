// Dynamic color generation for charts with high contrast
export const generateChartColors = (count) => {
  // Base palette of highly contrasting colors
  const baseColors = [
    '#FF6B6B', // Coral Red
    '#45B7D1', // Sky Blue
    '#96CEB4', // Mint Green
    '#F7DC6F', // Golden Yellow
    '#BB8FCE', // Light Purple
    '#85C1E9', // Light Blue
    '#82E0AA', // Light Green
    '#F1948A', // Salmon
    '#FAD7A0', // Cream
    '#D5A6BD' // Dusty Rose
  ];

  // If we need more colors than our base palette, generate additional ones
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }

  // Generate additional colors using HSL for better distribution
  const colors = [...baseColors];
  const additionalCount = count - baseColors.length;
  
  for (let i = 0; i < additionalCount; i++) {
    // Generate colors with good spacing in hue
    const hue = (i * 137.508) % 360; // Golden angle for good distribution
    const saturation = 65 + (i % 3) * 10; // Vary saturation (65-85%)
    const lightness = 55 + (i % 4) * 8; // Vary lightness (55-79%)
    
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};

// Alternative function for generating colors with specific contrast requirements
export const generateHighContrastColors = (count) => {
  const colors = [];
  
  // Use HSL color space for better control over contrast
  for (let i = 0; i < count; i++) {
    const hue = (i * 360 / count) % 360;
    const saturation = 70 + (i % 2) * 20; // Alternate between 70% and 90%
    const lightness = 50 + (i % 3) * 15; // Vary between 50%, 65%, 80%
    
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return colors;
};

// Function to ensure colors are sufficiently different from each other
export const ensureContrast = (colors) => {
  if (colors.length <= 1) return colors;
  
  const adjustedColors = [...colors];
  const minHueDifference = 30; // Minimum hue difference between colors
  const minSaturationDifference = 20; // Minimum saturation difference
  const minLightnessDifference = 15; // Minimum lightness difference
  
  // Convert hex colors to HSL for easier manipulation
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  };
  
  // Parse HSL string
  const parseHsl = (hslString) => {
    const match = hslString.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
    }
    return null;
  };
  
  // Get HSL values for a color
  const getHsl = (color) => {
    if (color.startsWith('#')) {
      return hexToHsl(color);
    } else if (color.startsWith('hsl')) {
      return parseHsl(color);
    }
    return [0, 50, 50]; // fallback
  };
  
  // Check if two colors are too similar
  const areColorsSimilar = (color1, color2) => {
    const [h1, s1, l1] = getHsl(color1);
    const [h2, s2, l2] = getHsl(color2);
    
    // Calculate hue difference (accounting for circular nature of hue)
    let hueDiff = Math.abs(h1 - h2);
    if (hueDiff > 180) hueDiff = 360 - hueDiff;
    
    const satDiff = Math.abs(s1 - s2);
    const lightDiff = Math.abs(l1 - l2);
    
    return hueDiff < minHueDifference && satDiff < minSaturationDifference && lightDiff < minLightnessDifference;
  };
  
  // Adjust colors that are too similar
  for (let i = 1; i < adjustedColors.length; i++) {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      let needsAdjustment = false;
      
      // Check against all previous colors
      for (let j = 0; j < i; j++) {
        if (areColorsSimilar(adjustedColors[i], adjustedColors[j])) {
          needsAdjustment = true;
          break;
        }
      }
      
      if (!needsAdjustment) break;
      
      // Adjust the color
      const [h, s, l] = getHsl(adjustedColors[i]);
      const newHue = (h + (attempts + 1) * 45) % 360; // Shift hue by 45 degrees each attempt
      const newSat = Math.max(40, Math.min(90, s + (attempts % 2 === 0 ? 15 : -15))); // Vary saturation
      const newLight = Math.max(35, Math.min(75, l + (attempts % 3 === 0 ? 10 : -10))); // Vary lightness
      
      adjustedColors[i] = `hsl(${newHue}, ${newSat}%, ${newLight}%)`;
      attempts++;
    }
  }
  
  return adjustedColors;
};
