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

// Setup safe image response (no moderation labels)
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

// Setup unsafe image response (has moderation labels)
export function mockUnsafeImage(labels: string[] = ['Explicit Nudity']) {
  rekognitionMock.on(DetectModerationLabelsCommand).resolves({
    ModerationLabels: labels.map((name) => ({
      Name: name,
      Confidence: 95.0,
      ParentName: 'Nudity',
    })),
  })
}

// Setup no face detected
export function mockNoFaceDetected() {
  rekognitionMock.on(DetectFacesCommand).resolves({
    FaceDetails: [],
  })
}

// Setup multiple faces detected
export function mockMultipleFaces(count: number = 2) {
  rekognitionMock.on(DetectFacesCommand).resolves({
    FaceDetails: Array(count).fill({
      BoundingBox: { Width: 0.3, Height: 0.3, Left: 0.1, Top: 0.1 },
      Confidence: 99.0,
    }),
  })
}

// Reset all AWS mocks
export function resetAwsMocks() {
  rekognitionMock.reset()
  mockSafeImage() // Default to safe image
}

// Initialize with safe defaults
mockSafeImage()
