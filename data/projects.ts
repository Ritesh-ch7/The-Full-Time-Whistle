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
    name: "The-Full-Time-Whistle",
    problem: "Personal Brand with Storytelling",
    description:
      "My personal portfolio built with a sports-driven narrative and immersive scene-based design.",
    stack: ["TypeScript", "Next.js", "Tailwind", "Framer Motion"],
    status: "In Progress",
    type: ["Web", "TypeScript"],
    githubUrl: "https://github.com/Ritesh-ch7/The-Full-Time-Whistle",
  },
  {
    id: "02",
    name: "OneStoreFrontend",
    problem: "Smooth Storefront Experience",
    description:
      "Frontend application for the OneStore platform focused on delivering a clean e-commerce user journey.",
    stack: ["JavaScript", "Frontend", "UI"],
    status: "Shipped",
    type: ["Web"],
    githubUrl: "https://github.com/Ritesh-ch7/OneStoreFrontend",
  },
  {
    id: "03",
    name: "OneStore",
    problem: "Store Operations and Logic",
    description:
      "Core backend and service logic for the OneStore ecosystem.",
    stack: ["Python", "API", "Backend"],
    status: "Shipped",
    type: ["Python"],
    githubUrl: "https://github.com/Ritesh-ch7/OneStore",
  },
  {
    id: "04",
    name: "Speech_Emotion_Recognition",
    problem: "Understanding Emotions in Speech",
    description:
      "Machine learning project for classifying human emotion from speech using real-time and stored audio.",
    stack: ["Python", "ML", "Audio", "Jupyter"],
    status: "Shipped",
    type: ["ML", "Python"],
    githubUrl: "https://github.com/Ritesh-ch7/Speech_Emotion_Recognition",
  },
  {
    id: "05",
    name: "Face_Detection",
    problem: "Detecting Faces in Real Time",
    description:
      "Computer vision notebook project for face detection experimentation and learning.",
    stack: ["Python", "ML", "Computer Vision", "Jupyter"],
    status: "Shipped",
    type: ["ML", "Python"],
    githubUrl: "https://github.com/Ritesh-ch7/Face_Detection",
  },
  {
    id: "06",
    name: "Address_Book",
    problem: "Simple Contact Management",
    description:
      "Java-based address book application to manage contacts and address information.",
    stack: ["Java", "GUI"],
    status: "Shipped",
    type: ["Web"],
    githubUrl: "https://github.com/Ritesh-ch7/Address_Book",
  },
  {
    id: "07",
    name: "TIC_TAC_TOE",
    problem: "Classic Game, Better UX",
    description:
      "GUI-based Tic Tac Toe game developed in Python.",
    stack: ["Python", "GUI"],
    status: "Shipped",
    type: ["Python"],
    githubUrl: "https://github.com/Ritesh-ch7/TIC_TAC_TOE",
  },
  {
    id: "08",
    name: "Encrypt_Decrypt",
    problem: "Secure Message Handling",
    description:
      "GUI utility to encrypt and decrypt user messages.",
    stack: ["Python", "Security", "GUI"],
    status: "Shipped",
    type: ["Python"],
    githubUrl: "https://github.com/Ritesh-ch7/Encrypt_Decrypt",
  },
  {
    id: "09",
    name: "The-WORDLE-game",
    problem: "Word Puzzle Gameplay",
    description:
      "Wordle-inspired GUI game implemented in Python.",
    stack: ["Python", "Game", "GUI"],
    status: "Shipped",
    type: ["Python"],
    githubUrl: "https://github.com/Ritesh-ch7/The-WORDLE-game",
  },
];

