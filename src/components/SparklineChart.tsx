"use client";

interface SparklineChartProps {
  data: number[];
  color?: string;
  height?: number;
  showArea?: boolean;
}

export default function SparklineChart({ data, color = "var(--primary)", height = 40, showArea = true }: SparklineChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  const areaPath = `M0,${height} L${data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((d - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" L")} L${w},${height} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      {showArea && (
        <path d={areaPath} fill={color} opacity="0.1" />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
