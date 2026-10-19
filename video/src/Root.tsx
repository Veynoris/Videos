import { Composition } from "remotion";
import { DURATION, Episode } from "./Episode";
import { FPS, H, W } from "./lib/theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="ThreeHundredAndNine" component={Episode} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
);
