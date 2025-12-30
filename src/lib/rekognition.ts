import {
  RekognitionClient,
  DetectModerationLabelsCommand,
  DetectFacesCommand,
} from '@aws-sdk/client-rekognition';

const client = new RekognitionClient({
  region: process.env['AWS_REGION'] ?? 'us-east-1',
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
  },
});

export interface ModerationResult {
  isApproved: boolean;
  flags: string[];
  confidence: number;
  hasFace: boolean;
}

const BLOCKED_LABELS = [
  'Explicit Nudity',
  'Nudity',
  'Graphic Male Nudity',
  'Graphic Female Nudity',
  'Sexual Activity',
  'Illustrated Explicit Nudity',
  'Adult Toys',
  'Violence',
  'Visually Disturbing',
  'Hate Symbols',
];

const MIN_CONFIDENCE = 80;

export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  try {
    // Fetch image as bytes
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const imageBytes = new Uint8Array(arrayBuffer);

    // Run moderation and face detection in parallel
    const [moderationResult, faceResult] = await Promise.all([
      client.send(
        new DetectModerationLabelsCommand({
          Image: { Bytes: imageBytes },
          MinConfidence: MIN_CONFIDENCE,
        })
      ),
      client.send(
        new DetectFacesCommand({
          Image: { Bytes: imageBytes },
          Attributes: ['DEFAULT'],
        })
      ),
    ]);

    const labels = moderationResult.ModerationLabels ?? [];
    const faces = faceResult.FaceDetails ?? [];

    // Check for blocked content
    const blockedLabels = labels.filter(
      (label) =>
        label.Name &&
        BLOCKED_LABELS.some((blocked) =>
          label.Name?.toLowerCase().includes(blocked.toLowerCase())
        )
    );

    const flags = blockedLabels.map((label) => label.Name ?? 'Unknown');
    const maxConfidence = blockedLabels.reduce(
      (max, label) => Math.max(max, label.Confidence ?? 0),
      0
    );

    return {
      isApproved: blockedLabels.length === 0 && faces.length > 0,
      flags,
      confidence: maxConfidence,
      hasFace: faces.length > 0,
    };
  } catch (error) {
    console.error('Moderation error:', error);
    // Fail closed - reject on error
    return {
      isApproved: false,
      flags: ['MODERATION_ERROR'],
      confidence: 0,
      hasFace: false,
    };
  }
}

export async function detectFaces(imageUrl: string): Promise<number> {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const imageBytes = new Uint8Array(arrayBuffer);

    const result = await client.send(
      new DetectFacesCommand({
        Image: { Bytes: imageBytes },
        Attributes: ['DEFAULT'],
      })
    );

    return result.FaceDetails?.length ?? 0;
  } catch (error) {
    console.error('Face detection error:', error);
    return 0;
  }
}
