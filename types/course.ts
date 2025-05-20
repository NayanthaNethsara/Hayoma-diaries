export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  creator: string;
  tags?: string[];
  instructions?: Instruction[];
  resources?: Resource[];
  enrolledUsers?: string[];
}

export interface Instruction {
  id: number;
  title: string;
  image?: string;
  description?: string;
}

export interface Resource {
  id: number;
  name: string;
  url: string;
}
