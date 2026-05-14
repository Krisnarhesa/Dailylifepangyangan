import { saveImageToLocal, deleteImageFromLocal } from '@/lib/admin/fileSystem';
import fs from 'fs/promises';
import path from 'path';

jest.mock('fs/promises');
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('optimized')),
  }));
});

describe('FileSystem Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveImageToLocal', () => {
    it('should save image successfully', async () => {
      (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const buffer = Buffer.from('test image');
      const result = await saveImageToLocal(buffer, 'images/test.jpg', false);

      expect(result.success).toBe(true);
      expect(result.path).toBe('/images/test.jpg');
      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (fs.mkdir as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const buffer = Buffer.from('test image');
      const result = await saveImageToLocal(buffer, 'images/test.jpg', false);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });

  describe('deleteImageFromLocal', () => {
    it('should delete image successfully', async () => {
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      const result = await deleteImageFromLocal('/images/test.jpg');

      expect(result.success).toBe(true);
      expect(fs.unlink).toHaveBeenCalled();
    });

    it('should handle deletion errors', async () => {
      (fs.unlink as jest.Mock).mockRejectedValue(new Error('File not found'));

      const result = await deleteImageFromLocal('/images/test.jpg');

      expect(result.success).toBe(false);
      expect(result.error).toBe('File not found');
    });
  });
});
