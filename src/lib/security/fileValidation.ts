// File validation utilities for secure file uploads

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp'],
  documents: ['application/pdf'],
  all: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILES = 5;

export const FILE_EXTENSIONS = {
  images: ['.jpg', '.jpeg', '.png', '.webp'],
  documents: ['.pdf'],
  all: ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
};

export interface FileValidationError {
  message: string;
  code: 'INVALID_TYPE' | 'TOO_LARGE' | 'TOO_MANY' | 'INVALID_EXTENSION';
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ALLOWED_FILE_TYPES.all
): FileValidationError | null {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      message: `File type not allowed. Accepted types: ${allowedTypes.join(', ')}`,
      code: 'INVALID_TYPE'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      message: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
      code: 'TOO_LARGE'
    };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!FILE_EXTENSIONS.all.includes(extension)) {
    return {
      message: `File extension not allowed. Accepted extensions: ${FILE_EXTENSIONS.all.join(', ')}`,
      code: 'INVALID_EXTENSION'
    };
  }

  return null;
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: FileList | null,
  allowedTypes: string[] = ALLOWED_FILE_TYPES.all
): FileValidationError[] {
  if (!files) return [];

  const errors: FileValidationError[] = [];

  // Check number of files
  if (files.length > MAX_FILES) {
    errors.push({
      message: `Too many files. Maximum allowed: ${MAX_FILES}`,
      code: 'TOO_MANY'
    });
    return errors;
  }

  // Validate each file
  for (let i = 0; i < files.length; i++) {
    const fileError = validateFile(files[i], allowedTypes);
    if (fileError) {
      errors.push(fileError);
    }
  }

  return errors;
}

/**
 * Get safe file display name (prevent directory traversal)
 */
export function getSafeFileName(fileName: string): string {
  // Remove any path components
  const baseName = fileName.split(/[/\\]/).pop() || 'file';
  
  // Remove special characters except . and -
  return baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
