export type InsightCategory =
  | "Development"
  | "Health & Fitness"
  | "Career & Education"
  | "Transfer Market"
  | "Interview"
  | "Biography";

export interface Insight {
  id: number;
  name: string;
  category: InsightCategory;
  description: string;
  content: string;
  imagePath: string;
  createdAt: string;
  updatedAt?: string;
}
