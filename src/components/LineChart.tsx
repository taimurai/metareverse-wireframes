"use client";

interface LineChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  showLabels?: boolean;
  showGrid?: boolean;
  formatValue?: (v: number) => string;
  secondaryData?: { label: string; value: number }[];
  secondaryColor?: string;
}

export default function LineChart({
  data,
  color = "var(--primary)",
  height = 180,
  showLabels = true,
  showGrid = true,
  formatValue = (v) => v.toLocaleString(),
  secondaryData,
  secondaryColor = "var(--text-muted)",
}: LineChartProps) {
  const allValues = [...data.map(d => d.value), ...(secondaryData?.map(d => d.value) || [])];
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1;
  const padTop = 10;
  const padBot = showLabels ? 24 : 4;
  const chartH = height - padTop - padBot;
  const w = 500;

  const toPoints = (dataset: typeof data) =>
    dataset.map((d, i) => {
      const x = (i / (dataset.length - 1)) * w;
      const y = padTop + chartH - ((d.value - min) / range) * chartH;
      return { x, y };
    });

  const pts = toPoints(data);
  const secPts = secondaryData ? toPoints(secondaryData) : null;
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const secPolyline = secPts?.map(p => `${p.x},${p.y}`).join(" ");

  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => min + (range / gridLines) * i);

  // Show ~6 labels max
  const labelStep = Math.ceil(data.length / 6);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      {showGrid && gridValues.map((v, i) => {
        const y = padTop + chartH - ((v - min) / range) * chartH;
        return (
          <g key={i}>
            <line x1={0} y1={y} x2={w} y2={y} stroke="var(--border)" strokeWidth="0.5" />
            <text x={-4} y={y + 3} fill="var(--text-muted)" fontSize="7" textAnchor="end" fontFamily="inherit">
              {formatValue(v)}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path
        d={`M0,${padTop + chartH} L${pts.map(p => `${p.x},${p.y}`).join(" L")} L${w},${padTop + chartH} Z`}
        fill={color}
        opacity="0.08"
      />

      {/* Secondary line */}
      {secPolyline && (
        <polyline
          points={secPolyline}
          fill="none"
          stroke={secondaryColor}
          strokeWidth="1.2"
          strokeDasharray="4,3"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* Primary line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* Dot on last point */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="3" fill={color} stroke="var(--surface)" strokeWidth="1.5" />

      {/* X labels */}
      {showLabels && data.map((d, i) => {
        if (i % labelStep !== 0 && i !== data.length - 1) return null;
        const x = (i / (data.length - 1)) * w;
        return (
          <text key={i} x={x} y={height - 2} fill="var(--text-muted)" fontSize="7" textAnchor="middle" fontFamily="inherit">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
