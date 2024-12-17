"use client";

import Compressor from 'compressorjs';

interface CompressorOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

type SuccessCallback = (compressedFile: File | Blob) => void;
type ErrorCallback = (error: Error) => void;

const handleCompressedUpload = (
  event: React.ChangeEvent<HTMLInputElement>,
  options: CompressorOptions = {},
  onSuccess?: SuccessCallback,
  onError?: ErrorCallback
): void => {
  const defaultOptions: CompressorOptions = {
    quality: 0.8, // Default quality
  };

  const image = event.target.files?.[0];
  if (!image) {
    console.warn('No file selected.');
    return;
  }

  new Compressor(image, {
    ...defaultOptions,
    ...options, // Merge custom options
    success: (compressedResult) => {
      if (onSuccess) {
        onSuccess(compressedResult);
      } else {
        console.warn('No onSuccess callback provided.');
      }
    },
    error: (err) => {
      if (onError) {
        onError(err);
      } else {
        console.error('Compression failed:', err);
      }
    },
  });
};

export default handleCompressedUpload;