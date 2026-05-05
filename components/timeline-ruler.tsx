import { TimecodeLabel } from "./timecode-label";

const defaultTicks = [
  "00:00:00",
  "00:30:12",
  "01:00:00",
  "01:30:12",
  "02:00:00"
];

export function TimelineRuler({
  ticks = defaultTicks,
  inPoint,
  outPoint
}: {
  ticks?: string[];
  inPoint?: string;
  outPoint?: string;
}) {
  return (
    <div className="ruler flex flex-col gap-2 border-y border-divider bg-panel/70 px-3 py-2">
      <div className="flex items-center justify-between text-[10px] text-ink-muted">
        <span className="label-tech">Timecode</span>
        <div className="flex items-center gap-4">
          {inPoint ? (
            <span className="label-tech text-cyan">IN {inPoint}</span>
          ) : null}
          {outPoint ? (
            <span className="label-tech text-cyan">OUT {outPoint}</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between">
        {ticks.map((tick) => (
          <TimecodeLabel key={tick} value={`TC ${tick}`} />
        ))}
      </div>
    </div>
  );
}
