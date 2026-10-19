import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/amiri-quran/400.css";
import { Composition, staticFile } from "remotion";

const kfg = new FontFace("KFGQPC Hafs", `url(${staticFile("fonts/KFGQPC-Uthmanic-Hafs.otf")})`);
document.fonts.add(kfg);
kfg.load();

export const MyComposition = () => {
  return (
    <Composition
      id="FontTest"
      component={FontTest}
      durationInFrames={30}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

const FontTest: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "#0b1322",
        color: "#e9e4da",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
      }}
    >
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 22, letterSpacing: "0.4em" }}>
        SURAH YUNUS · 10:61
      </div>
      <div dir="rtl" style={{ fontFamily: "KFGQPC Hafs", fontSize: 72, lineHeight: 2, textAlign: "center", padding: 80 }}>
        وَمَا يَعۡزُبُ عَن رَّبِّكَ مِن مِّثۡقَالِ ذَرَّةٖ فِي ٱلۡأَرۡضِ وَلَا فِي ٱلسَّمَآءِ
      </div>
      <div style={{ fontFamily: "Newsreader", fontSize: 72 }}>
        Earth. <i style={{ color: "#7fd1c7" }}>Heaven.</i>
      </div>
    </div>
  );
};
