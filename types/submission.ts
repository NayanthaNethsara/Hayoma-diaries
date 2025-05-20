export interface Submission {
  id: number;
  fileKey: string;
  submittedAt: string;
  points: number;
  studentId: number;
  courseId: number;
  reviewMessage?: string;
}
