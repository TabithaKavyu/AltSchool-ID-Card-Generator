import { toPng } from 'html-to-image';

export const downloadIdCard = async (elementId: string, fileName: string) => {
  const node = document.getElementById(elementId);
  if (!node) return;

  try {
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2, // Higher quality
      backgroundColor: 'transparent',
    });
    
    const link = document.createElement('a');
    link.download = `${fileName.replace(/\s+/g, '_')}_ID.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('oops, something went wrong!', error);
    alert('Failed to generate image. Please try again.');
  }
};