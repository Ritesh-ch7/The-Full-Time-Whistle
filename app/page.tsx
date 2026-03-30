import MatchdayCard from "@/components/scenes/MatchdayCard";
import SquadSheet from "@/components/scenes/SquadSheet";
import WalkingToGround from "@/components/scenes/WalkingToGround";
import TheTunnel from "@/components/scenes/TheTunnel";
import ProfessionalExperience from "@/components/scenes/ProfessionalExperience";
import Kickoff from "@/components/scenes/Kickoff";
import HalfTime from "@/components/scenes/HalfTime";
import PressBox from "@/components/scenes/PressBox";
import FinalWhistle from "@/components/scenes/FinalWhistle";

export default function Home() {
  return (
    <main>
      {/* Scene 1 — The Matchday Card */}
      <MatchdayCard />

      {/* Scene 2 — The Dressing Room */}
      <TheTunnel />

      {/* Scene 3 — The Starting XI */}
      <SquadSheet />

      {/* Scene 4 — Walking to the Ground: Career Journey */}
      <WalkingToGround />

      {/* Scene 5 — Kickoff: Professional Experience Overview */}
      <ProfessionalExperience />

      {/* Scene 6 — Halftime: The Projects */}
      <Kickoff />

      {/* Scene 7 — Half Time: The Stats Board */}
      <HalfTime />

      {/* Scene 8 — Post-Match: Contact */}
      <FinalWhistle />

      {/* Scene 9 — The Press Box: Writing */}
      <PressBox />
    </main>
  );
}
