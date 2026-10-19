import { Composition, Still } from "remotion";
import { DURATION, Episode } from "./Episode";
import { Cover } from "./Cover";
import { FPS, H, W } from "./lib/theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ThreeHundredAndNine" component={Episode} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Still id="ReelCover" component={Cover} width={W} height={H} />
  </>
);
