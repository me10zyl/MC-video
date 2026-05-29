import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";

const clamp = (value: number, input: [number, number], output: [number, number]) =>
  interpolate(value, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const ease = (value: number, input: [number, number], output: [number, number]) =>
  interpolate(value, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type PixelProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  radius?: number;
  opacity?: number;
};

const Pixel = ({ x, y, w, h, color, radius = 0, opacity = 1 }: PixelProps) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: color,
      borderRadius: radius,
      opacity,
      boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.18)",
    }}
  />
);

const Chest = ({ x, y, label, color, glow }: { x: number; y: number; label: string; color: string; glow: number }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <div
      style={{
        position: "absolute",
        left: -14,
        top: -14,
        width: 128,
        height: 96,
        border: `3px solid rgba(74, 222, 128, ${glow})`,
        borderRadius: 10,
        boxShadow: `0 0 ${glow * 36}px rgba(74, 222, 128, ${glow})`,
      }}
    />
    <Pixel x={0} y={18} w={100} h={58} color="#9a5b24" radius={5} />
    <Pixel x={0} y={0} w={100} h={30} color="#c78231" radius={5} />
    <Pixel x={42} y={25} w={16} h={16} color="#f8d86a" radius={2} />
    <Pixel x={8} y={36} w={84} h={8} color="#6b3d1a" />
    <Pixel x={12} y={8} w={28} h={8} color="rgba(255,255,255,0.22)" />
    <div
      style={{
        position: "absolute",
        top: 86,
        left: -18,
        width: 136,
        textAlign: "center",
        color: "#e7f5d7",
        fontSize: 21,
        fontWeight: 900,
        textShadow: "0 3px 0 #17320f",
      }}
    >
      {label}
    </div>
    <div
      style={{
        position: "absolute",
        left: 34,
        top: -34,
        width: 32,
        height: 32,
        background: color,
        transform: "rotate(45deg)",
        border: "4px solid rgba(255,255,255,0.55)",
        boxShadow: "0 8px 0 rgba(0,0,0,0.25)",
      }}
    />
  </div>
);

const Item = ({ frame, start, from, to, color, shape }: { frame: number; start: number; from: [number, number]; to: [number, number]; color: string; shape: "cube" | "gem" | "ingot" }) => {
  const p = ease(frame, [start, start + 30], [0, 1]);
  const arc = Math.sin(p * Math.PI) * 86;
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p - arc;
  const scale = clamp(frame, [start + 23, start + 30], [1, 0.25]);
  const opacity = clamp(frame, [start + 26, start + 30], [1, 0]);
  const rotate = p * 360;

  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg) scale(${scale})`, opacity }}>
      {shape === "cube" && <Pixel x={0} y={0} w={34} h={34} color={color} radius={4} />}
      {shape === "gem" && (
        <div style={{ width: 34, height: 34, background: color, transform: "rotate(45deg)", boxShadow: "inset -5px -5px 0 rgba(0,0,0,0.22)" }} />
      )}
      {shape === "ingot" && <Pixel x={0} y={8} w={42} h={20} color={color} radius={5} />}
    </div>
  );
};

const Steve = ({ frame }: { frame: number }) => {
  const throwMotion = spring({ frame: frame - 43, fps: 30, config: { damping: 12, stiffness: 90 } });
  const arm = -18 - throwMotion * 64 + clamp(frame, [63, 79], [0, 56]);
  const bob = Math.sin(frame / 9) * 3;

  return (
    <div style={{ position: "absolute", left: 160, top: 296 + bob }}>
      <Pixel x={44} y={0} w={58} h={58} color="#c98b58" radius={5} />
      <Pixel x={56} y={18} w={10} h={10} color="#1b2930" />
      <Pixel x={82} y={18} w={10} h={10} color="#1b2930" />
      <Pixel x={44} y={0} w={58} h={16} color="#3f2716" />
      <Pixel x={32} y={60} w={82} h={82} color="#2da9c9" radius={4} />
      <div style={{ position: "absolute", left: 18, top: 66, transformOrigin: "47px 10px", transform: `rotate(${arm}deg)` }}>
        <Pixel x={0} y={0} w={72} h={20} color="#c98b58" radius={5} />
        <Pixel x={50} y={0} w={26} h={20} color="#2da9c9" radius={5} />
      </div>
      <Pixel x={102} y={68} w={22} h={70} color="#c98b58" radius={5} />
      <Pixel x={42} y={142} w={28} h={74} color="#344bb1" radius={4} />
      <Pixel x={76} y={142} w={28} h={74} color="#344bb1" radius={4} />
      <Pixel x={34} y={208} w={38} h={18} color="#2b211d" radius={3} />
      <Pixel x={74} y={208} w={38} h={18} color="#2b211d" radius={3} />
    </div>
  );
};

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const scan = clamp(frame, [69, 96], [-120, 1180]);
  const titleIn = ease(frame, [4, 21], [0, 1]);
  const saveIn = ease(frame, [142, 159], [0, 1]);
  const chestGlowA = clamp(frame, [79, 93], [0, 1]) * clamp(frame, [115, 128], [1, 0.35]);
  const chestGlowB = clamp(frame, [87, 104], [0, 1]) * clamp(frame, [123, 136], [1, 0.35]);
  const chestGlowC = clamp(frame, [95, 112], [0, 1]) * clamp(frame, [131, 145], [1, 0.35]);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#79c8ff 0%, #b8ecff 46%, #6eb94d 46%, #5ca13e 100%)", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.09) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.09) 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
      <Pixel x={0} y={565} w={1280} h={58} color="#7b5630" />
      {Array.from({ length: 20 }).map((_, i) => (
        <Pixel key={i} x={i * 64} y={535 + (i % 2) * 10} w={64} h={38} color={i % 2 ? "#64ad43" : "#76c451"} />
      ))}

      <div style={{ position: "absolute", top: 44, left: 62, opacity: titleIn, transform: `translateY(${(1 - titleIn) * -24}px)` }}>
        <div style={{ color: "#ffffff", fontSize: 62, fontWeight: 950, letterSpacing: 1, textShadow: "0 6px 0 #1c5b27, 0 12px 28px rgba(0,0,0,0.28)" }}>箱子自动分类MOD</div>
        <div style={{ marginTop: 8, color: "#14351b", fontSize: 28, fontWeight: 900, background: "rgba(255,255,255,0.78)", padding: "10px 18px", borderRadius: 12, display: "inline-block" }}>掉落物自动识别 · 分类 · 入箱</div>
      </div>

      <Chest x={766} y={346} label="矿石" color="#5eead4" glow={chestGlowA} />
      <Chest x={928} y={346} label="食物" color="#fb923c" glow={chestGlowB} />
      <Chest x={1090} y={346} label="建材" color="#a3e635" glow={chestGlowC} />
      <Steve frame={frame} />

      <Item frame={frame} start={46} from={[265, 365]} to={[812, 350]} color="#46d9cf" shape="gem" />
      <Item frame={frame} start={55} from={[273, 382]} to={[970, 350]} color="#f97316" shape="ingot" />
      <Item frame={frame} start={64} from={[280, 398]} to={[1130, 350]} color="#8b5a2b" shape="cube" />

      <div style={{ position: "absolute", left: scan, top: 238, width: 118, height: 258, border: "5px solid rgba(74,222,128,0.9)", background: "rgba(74,222,128,0.13)", boxShadow: "0 0 34px rgba(74,222,128,0.75)", opacity: clamp(frame, [68, 75], [0, 1]) * clamp(frame, [100, 110], [1, 0]) }} />
      <div style={{ position: "absolute", left: 750, top: 246, color: "#d9ffe3", fontSize: 30, fontWeight: 950, textShadow: "0 4px 0 #12401b", opacity: clamp(frame, [79, 92], [0, 1]) }}>扫描附近箱子</div>

      <div style={{ position: "absolute", left: 430, bottom: 54, width: 420, height: 72, borderRadius: 16, background: "rgba(255,255,255,0.88)", border: "4px solid #365b2c", opacity: saveIn, transform: `scale(${0.86 + saveIn * 0.14})` }}>
        <div style={{ color: "#24421e", fontSize: 28, fontWeight: 950, textAlign: "center", lineHeight: "66px" }}>配置与箱子数据永久保存</div>
      </div>
    </AbsoluteFill>
  );
};
