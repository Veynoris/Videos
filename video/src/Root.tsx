import { Composition, Still } from "remotion";
import { DURATION, Episode } from "./Episode";
import { Cover } from "./Cover";
import { DURATION2, Episode2 } from "./ep02/Episode";
import { Cover2 } from "./ep02/Cover";
import { FPS, H, W } from "./lib/theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ThreeHundredAndNine" component={Episode} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Still id="ReelCover" component={Cover} width={W} height={H} />
    <Still id="Ep02Cover" component={Cover2} width={W} height={H} />
    <Composition id="MusasMother" component={Episode2} durationInFrames={DURATION2} fps={FPS} width={W} height={H} />
  </>
);
