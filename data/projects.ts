export type ProjectStatus = "Shipped" | "In Progress" | "Archived";

export interface Project {
  id: string;
  name: string;
  problem: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  type: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: "01",
    name: "Project Alpha",
    problem: "The Cold Start Problem",
    description:
      "One line describing what it does and why it matters to real people.",
    stack: ["PyTorch", "Transformers", "FastAPI", "Docker"],
    status: "Shipped",
    type: ["ML", "Python"],
    githubUrl: "https://github.com/yourhandle",
  },
  {
    id: "02",
    name: "Project Beta",
    problem: "Too Much Noise, Not Enough Signal",
    description:
      "One line describing what it does and why it matters to real people.",
    stack: ["Next.js", "Tailwind", "Supabase"],
    status: "In Progress",
    type: ["Web", "TypeScript"],
    githubUrl: "https://github.com/yourhandle",
    liveUrl: "https://yourproject.vercel.app",
  },
  {
    id: "03",
    name: "Project Gamma",
    problem: "The Missing Baseline",
    description:
      "One line describing what it does and why it matters to real people.",
    stack: ["Python", "Scikit-learn", "Docker"],
    status: "Shipped",
    type: ["ML", "Python"],
    githubUrl: "https://github.com/yourhandle",
  },
];

