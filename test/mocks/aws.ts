/**
 * AWS SDK Mock for Unit Testing (Rekognition)
 */

import { vi } from 'vitest'
import { mockClient } from 'aws-sdk-client-mock'
import {
  RekognitionClient,
  DetectModerationLabelsCommand,
  DetectFacesCommand,
} from '@aws-sdk/client-rekognition'

// Create mock client
export const rekognitionMock = mockClient(RekognitionClient)

/**
 * Configure the exported Rekognition mock to simulate a safe image response.
 *
 * Sets the mock to return no moderation labels and a single detected face with
 * a centered bounding box, high confidence, and basic pose/quality attributes.
 */
export function mockSafeImage() {
  rekognitionMock.on(DetectModerationLabelsCommand).resolves({
    ModerationLabels: [],
  })

  rekognitionMock.on(DetectFacesCommand).resolves({
    FaceDetails: [
      {
        BoundingBox: { Width: 0.5, Height: 0.5, Left: 0.25, Top: 0.25 },
        Confidence: 99.9,
        Landmarks: [],
        Pose: { Roll: 0, Yaw: 0, Pitch: 0 },
        Quality: { Brightness: 80, Sharpness: 90 },
      },
    ],
  })
}

/**
 * Configure the Rekognition mock to simulate an unsafe image by returning moderation labels.
 *
 * @param labels - Array of moderation label names to include; defaults to `['Explicit Nudity']`.
 */
export function mockUnsafeImage(labels: string[] = ['Explicit Nudity']) {
  rekognitionMock.on(DetectModerationLabelsCommand).resolves({
    ModerationLabels: labels.map((name) => ({
      Name: name,
      Confidence: 95.0,
      ParentName: 'Nudity',
    })),
  })
}

/**
 * Configure the Rekognition mock to simulate no faces detected in an image.
 *
 * Sets the mock response for DetectFacesCommand to return an empty `FaceDetails` array.
 */
export function mockNoFaceDetected() {
  rekognitionMock.on(DetectFacesCommand).resolves({
    FaceDetails: [],
  })
}

/**
 * Configures the Rekognition mock to return a response with a specified number of detected faces.
 *
 * @param count - Number of FaceDetails entries to include in the mocked DetectFaces response (default 2)
 */
export function mockMultipleFaces(count: number = 2) {
  rekognitionMock.on(DetectFacesCommand).resolves({
    FaceDetails: Array(count).fill({
      BoundingBox: { Width: 0.3, Height: 0.3, Left: 0.1, Top: 0.1 },
      Confidence: 99.0,
    }),
  })
}

/**
 * Reset the Rekognition mock to a clean state and configure it with a default safe image.
 *
 * Clears all previously configured mock responses on the Rekognition mock client and
 * reinitializes it so subsequent calls simulate a safe image (no moderation labels and a single face).
 */
export function resetAwsMocks() {
  rekognitionMock.reset()
  mockSafeImage() // Default to safe image
}

// Initialize with safe defaults
mockSafeImage()