import imageCompression from 'browser-image-compression';

interface CompressOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  previousCompressedFile?: File | null;
}

const compressImage = async (
  file: File,
  maxSizeMB: number,
  maxWidthOrHeight: number,
  previousCompressedFile: File | null = null
): Promise<File> => {
  console.log('Starting image compression...');
  console.log(`Original file size: ${(file.size / 1024).toFixed(2)} KB`);
  console.log(`Target size: ${maxSizeMB} MB, Max dimensions: ${maxWidthOrHeight}px`);

  const options: CompressOptions = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: maxWidthOrHeight,
    previousCompressedFile,
  };

  try {
    console.log('Compressing the image...');
    const compressedFile = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      useWebWorker: true, 
      fileType: 'image/png', 
      initialQuality: options.previousCompressedFile
        ? options.previousCompressedFile.size / file.size
        : 0.8,
    });

    // Post compression log
    console.log('Compression finished.');
    console.log(`Compressed file size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
    console.log(`Compression quality: ${((compressedFile.size / file.size) * 100).toFixed(2)}%`);
    return compressedFile;
  } catch (error) {
    console.error('Error during compression:', error);
    throw new Error('Image compression failed');
  }
};

export default compressImage;
