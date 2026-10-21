import { Composition, Still } from "remotion";
import { DURATION, Episode } from "./Episode";
import { Cover } from "./Cover";
import { DURATION2, Episode2 } from "./ep02/Episode";
import { Cover2 } from "./ep02/Cover";
import { DURATION3, Episode3 } from "./ep03/Episode";
import { Cover3 } from "./ep03/Cover";
import { DURATION4, Episode4 } from "./ep04/Episode";
import { Cover4 } from "./ep04/Cover";
import { DURATION5, Episode5 } from "./ep05/Episode";
import { Cover5 } from "./ep05/Cover";
import { DURATION6, Episode6 } from "./ep06/Episode";
import { Cover6 } from "./ep06/Cover";
import { DURATION7, Episode7 } from "./ep07/Episode";
import { Cover7 } from "./ep07/Cover";
import { DURATION8, Episode8 } from "./ep08/Episode";
import { Cover8 } from "./ep08/Cover";
import { FPS, H, W } from "./lib/theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ThreeHundredAndNine" component={Episode} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
    <Still id="ReelCover" component={Cover} width={W} height={H} />
    <Still id="Ep02Cover" component={Cover2} width={W} height={H} />
    <Still id="Ep03Cover" component={Cover3} width={W} height={H} />
    <Composition id="TheDarknesses" component={Episode8} durationInFrames={DURATION8} fps={FPS} width={W} height={H} />
    <Still id="Ep08Cover" component={Cover8} width={W} height={H} />
    <Composition id="OneAnt" component={Episode7} durationInFrames={DURATION7} fps={FPS} width={W} height={H} />
    <Still id="Ep07Cover" component={Cover7} width={W} height={H} />
    <Composition id="OneSeed" component={Episode6} durationInFrames={DURATION6} fps={FPS} width={W} height={H} />
    <Still id="Ep06Cover" component={Cover6} width={W} height={H} />
    <Composition id="ThreeShirts" component={Episode5} durationInFrames={DURATION5} fps={FPS} width={W} height={H} />
    <Still id="Ep05Cover" component={Cover5} width={W} height={H} />
    <Still id="Ep04Cover" component={Cover4} width={W} height={H} />
    <Composition id="HearingSeeing" component={Episode4} durationInFrames={DURATION4} fps={FPS} width={W} height={H} />
    <Composition id="CaveFacingNorth" component={Episode3} durationInFrames={DURATION3} fps={FPS} width={W} height={H} />
    <Composition id="MusasMother" component={Episode2} durationInFrames={DURATION2} fps={FPS} width={W} height={H} />
  </>
);
