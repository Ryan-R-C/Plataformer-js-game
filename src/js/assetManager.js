import { ASSET_URLS } from './constants.js';

class AssetManager {
  constructor() {
    this.images = {};
    this.loadedCount = 0;
    this.totalAssets = 0;
  }

  async loadAssets() {
    const imagePromises = Object.entries(ASSET_URLS).map(([key, url]) => {
      return this.loadImage(key, url);
    });

    this.totalAssets = imagePromises.length;
    
    try {
      await Promise.all(imagePromises);
      console.log('All assets loaded successfully');
    } catch (error) {
      console.error('Failed to load assets:', error);
      throw error;
    }
  }

  loadImage(key, url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      
      image.onload = () => {
        this.images[key] = image;
        this.loadedCount++;
        resolve(image);
      };
      
      image.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      image.src = url;
    });
  }

  getImage(key) {
    const image = this.images[key];
    if (!image) {
      throw new Error(`Image not found: ${key}`);
    }
    return image;
  }

  getLoadingProgress() {
    return this.totalAssets === 0 ? 0 : this.loadedCount / this.totalAssets;
  }
}

export const assetManager = new AssetManager();
