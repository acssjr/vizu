/**
 * Cloudinary Mock for Unit Testing
 */

import { vi } from 'vitest'

export const cloudinaryUploadMock = vi.fn().mockResolvedValue({
  secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg',
  public_id: 'test-image',
  width: 800,
  height: 600,
  format: 'jpg',
  bytes: 150000,
})

export const cloudinaryDestroyMock = vi.fn().mockResolvedValue({
  result: 'ok',
})

export const cloudinaryMock = {
  v2: {
    config: vi.fn(),
    uploader: {
      upload: cloudinaryUploadMock,
      destroy: cloudinaryDestroyMock,
      upload_stream: vi.fn(),
    },
    url: vi.fn((publicId: string) => `https://res.cloudinary.com/test/image/upload/${publicId}`),
  },
}

/**
 * Reset the Cloudinary upload and destroy mocks to their initial configured states.
 *
 * Reinitializes `cloudinaryUploadMock` and `cloudinaryDestroyMock`, clearing call history
 * and restoring their default resolved values used by tests.
 */
export function resetCloudinaryMocks() {
  cloudinaryUploadMock.mockReset()
  cloudinaryUploadMock.mockResolvedValue({
    secure_url: 'https://res.cloudinary.com/test/image/upload/v1234567890/test-image.jpg',
    public_id: 'test-image',
    width: 800,
    height: 600,
    format: 'jpg',
    bytes: 150000,
  })

  cloudinaryDestroyMock.mockReset()
  cloudinaryDestroyMock.mockResolvedValue({ result: 'ok' })
}

/**
 * Instructs Vitest to mock the 'cloudinary' module with the exported test mock.
 */
export function setupCloudinaryMock() {
  vi.mock('cloudinary', () => cloudinaryMock)
}