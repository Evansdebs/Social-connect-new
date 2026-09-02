/**
 * Helper utility for handling real image & media uploads on the client.
 * Supports file input, drag-and-drop, client-side compression/resizing,
 * and data URL encoding for instant preview and Firestore persistence.
 */

export interface ProcessedMedia {
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
}

/**
 * Resizes an image file to max dimensions and converts to JPEG Data URL
 * to avoid exceeding Firestore's document limit (1MB max document size).
 */
export async function processImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<ProcessedMedia> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return resolve({
            url: readerEvent.target?.result as string,
            type: 'image',
            name: file.name,
            size: file.size
          });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        resolve({
          url: dataUrl,
          type: 'image',
          name: file.name,
          size: Math.round(dataUrl.length * 0.75) // approximate bytes
        });
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Process a video file (for reels / stories preview).
 */
export async function processVideoFile(file: File): Promise<ProcessedMedia> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      return reject(new Error('Selected file is not a video'));
    }

    // If file is too large (> 15MB) warn user
    if (file.size > 15 * 1024 * 1024) {
      return reject(new Error('Video is too large. Please select a video under 15MB.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        url: e.target?.result as string,
        type: 'video',
        name: file.name,
        size: file.size
      });
    };
    reader.onerror = () => reject(new Error('Failed to read video file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Validate and read a video file with size information
 */
export async function validateVideoFile(file: File): Promise<{ url: string; sizeMb: number }> {
  const media = await processVideoFile(file);
  return {
    url: media.url,
    sizeMb: file.size / (1024 * 1024)
  };
}

const STOCK_IMAGES = [
  {
    title: 'Students Collaborating in Library',
    category: 'Study',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80'
  },
  {
    title: 'Campus Football & Sports Field',
    category: 'Sports',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&auto=format&fit=crop&q=80'
  },
  {
    title: 'Science Lab & Robotics Innovation',
    category: 'STEM',
    url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=900&auto=format&fit=crop&q=80'
  },
  {
    title: 'Debate & Public Speaking Society',
    category: 'Clubs',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&auto=format&fit=crop&q=80'
  },
  {
    title: 'Campus Quad & Green Grounds',
    category: 'Campus',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&auto=format&fit=crop&q=80'
  },
  {
    title: 'Graduation & Academic Excellence',
    category: 'Honors',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&auto=format&fit=crop&q=80'
  }
];

const STOCK_VIDEOS = [
  {
    title: 'Basketball Championship Drills',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-students-playing-basketball-on-an-outdoor-court-41539-large.mp4'
  },
  {
    title: 'Campus Walk & Friends Chatting',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-walking-together-in-a-park-42991-large.mp4'
  },
  {
    title: 'Robotics Coding Showcase',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-43343-large.mp4'
  },
  {
    title: 'Music Band & Drumming Practice',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-playing-acoustic-guitar-in-a-studio-43285-large.mp4'
  }
];

/**
 * Curated high-resolution campus stock media for quick publishing
 */
export const CURATED_CAMPUS_MEDIA = Object.assign(STOCK_IMAGES, {
  images: STOCK_IMAGES,
  videos: STOCK_VIDEOS
});
