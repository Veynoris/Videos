import { Composition, Still } from "remotion";
import { DURATION, Episode } from "./Episode";
import { Cover } from "./Cover";
import { DURATION2, Episode2 } from "./ep02/Episode";
import { Cover2 } from "./ep02/Cover";
import { DURATION3, Episode3 } from "./ep03/Episode";
import { Cover3 } from "./ep03/Cover";
import { FPS, H, W } from "./lib/theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ThreeHundredAndNine" component={Episode} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Still id="ReelCover" component={Cover} width={W} height={H} />
    <Still id="Ep02Cover" component={Cover2} width={W} height={H} />
    <Still id="Ep03Cover" component={Cover3} width={W} height={H} />
    <Composition id="CaveFacingNorth" component={Episode3} durationInFrames={DURATION3} fps={FPS} width={W} height={H} />
    <Composition id="MusasMother" component={Episode2} durationInFrames={DURATION2} fps={FPS} width={W} height={H} />
  </>
);
