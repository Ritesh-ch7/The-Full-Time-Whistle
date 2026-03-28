import MatchdayCard from "@/components/scenes/MatchdayCard";
import SquadSheet from "@/components/scenes/SquadSheet";
import WalkingToGround from "@/components/scenes/WalkingToGround";
import TheTunnel from "@/components/scenes/TheTunnel";
import Kickoff from "@/components/scenes/Kickoff";
import HalfTime from "@/components/scenes/HalfTime";
import SecondHalf from "@/components/scenes/SecondHalf";
import FinalWhistle from "@/components/scenes/FinalWhistle";

export default function Home() {
  return (
    <main>
      {/* Scene 1 — The Matchday Card */}
      <MatchdayCard />

      {/* Scene 2 — The Squad Sheet */}
      <SquadSheet />

      {/* Scene 3 — Walking to the Ground */}
      <WalkingToGround />

      {/* Scene 4 — The Tunnel */}
      <TheTunnel />

      {/* Scene 5 — Kickoff: The Projects */}
      <Kickoff />

      {/* Scene 6 — Half Time: The Stats Board */}
      <HalfTime />

      {/* Scene 7 — Second Half: The Writing */}
      <SecondHalf />

      {/* Scene 8 — Final Whistle: Contact */}
      <FinalWhistle />
    </main>
  );
}
