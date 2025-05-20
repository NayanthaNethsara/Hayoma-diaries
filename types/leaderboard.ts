export interface LeaderboardUser {
  userId: number;
  username: string;
  totalPoints: number;
  weeklyPoints?: number;
  coursePoints?: number;
  courseProgress?: number;
}
