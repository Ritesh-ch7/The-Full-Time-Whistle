export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export const humanStats: Stat[] = [
  { label: "Matches Watched", value: "500", suffix: "+" },
  { label: "Goals (5-a-side)", value: "47" },
  { label: "F1 Races Watched", value: "200", suffix: "+" },
  { label: "Cups of Chai", value: "∞" },
  { label: "Countries Visited", value: "12" },
  { label: "Books Read", value: "60", suffix: "+" },
];

export const technicalStats: Stat[] = [
  { label: "Years in ML", value: "4", suffix: "+" },
  { label: "Models Trained", value: "200", suffix: "+" },
  { label: "GitHub Commits", value: "1.2k", suffix: "+" },
  { label: "Papers Read", value: "80", suffix: "+" },
  { label: "PRs Merged", value: "300", suffix: "+" },
  { label: "Stack Overflow", value: "14k", suffix: " visits" },
];

