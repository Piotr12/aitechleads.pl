/**
 * A "metro map" of the two running examples: the feature starts at Discovery, the bug at Intake,
 * they travel side by side and converge on the same review, QA and merge.
 */
import { STAGES } from "../_data/stages";

const X0 = 60;
const DX = 98;
const Y_FEATURE = 92;
const Y_BUG = 162;
const Y_MERGED = 127;
const xOf = (i: number) => X0 + i * DX;

const FEATURE_NOTES = ["brief + backlog", "#412 filed", "feature gate", "claimed", "spec → build"];
const BUG_NOTES = ["", "#418 filed", "verify-in-repo", "claimed", "root cause → fix"];
const MERGED_NOTES = ["#431 · #433", "agent + Ada", "Quinn tests", "squash-merge", "close · follow-up"];

export function RouteMap() {
  const join = xOf(5);
  const split = xOf(4);
  const mid = (split + join) / 2;
  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <svg
          viewBox="0 0 1000 230"
          role="img"
          aria-labelledby="route-map-title"
          className="h-auto w-full min-w-[760px]"
        >
          <title id="route-map-title">
            Two example journeys: the CSV export feature starts at Discovery, the double-discount bug starts at
            Intake; both converge at Pull request and share Review, QA, Merge and Cleanup.
          </title>

          {/* Stage names */}
          {STAGES.map((s, i) => (
            <g key={s.id}>
              <line
                x1={xOf(i)}
                x2={xOf(i)}
                y1={44}
                y2={200}
                className="stroke-border"
                strokeDasharray="2 4"
              />
              <text x={xOf(i)} y={22} textAnchor="middle" className="fill-muted-foreground font-mono text-[11px]">
                {s.n}
              </text>
              <text x={xOf(i)} y={38} textAnchor="middle" className="fill-foreground text-[11.5px] font-medium">
                {s.name === "Discovery & Design" ? "Discovery" : s.name}
              </text>
            </g>
          ))}

          {/* Tracks */}
          <path
            d={`M ${xOf(0)} ${Y_FEATURE} H ${split} C ${mid} ${Y_FEATURE}, ${mid} ${Y_MERGED}, ${join} ${Y_MERGED} H ${xOf(9)}`}
            className="fill-none stroke-violet-500"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M ${xOf(1)} ${Y_BUG} H ${split} C ${mid} ${Y_BUG}, ${mid} ${Y_MERGED}, ${join} ${Y_MERGED}`}
            className="fill-none stroke-red-500"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M ${join} ${Y_MERGED} H ${xOf(9)}`}
            className="fill-none stroke-foreground/70"
            strokeWidth={6}
            strokeLinecap="round"
          />

          {/* Feature stations */}
          {FEATURE_NOTES.map((note, i) => (
            <g key={`f${i}`}>
              <circle cx={xOf(i)} cy={Y_FEATURE} r={8} className="fill-background stroke-violet-500" strokeWidth={3} />
              <text x={xOf(i)} y={Y_FEATURE - 16} textAnchor="middle" className="fill-violet-700 text-[10.5px] dark:fill-violet-300">
                {note}
              </text>
            </g>
          ))}
          {/* Bug stations */}
          {BUG_NOTES.map((note, i) =>
            note ? (
              <g key={`b${i}`}>
                <circle cx={xOf(i)} cy={Y_BUG} r={8} className="fill-background stroke-red-500" strokeWidth={3} />
                <text x={xOf(i)} y={Y_BUG + 26} textAnchor="middle" className="fill-red-700 text-[10.5px] dark:fill-red-300">
                  {note}
                </text>
              </g>
            ) : null,
          )}
          {/* Shared stations */}
          {MERGED_NOTES.map((note, k) => {
            const i = k + 5;
            const gate = STAGES[i].gates.length > 0;
            return (
              <g key={`m${i}`}>
                <circle
                  cx={xOf(i)}
                  cy={Y_MERGED}
                  r={9}
                  className={gate ? "fill-red-500 stroke-background" : "fill-background stroke-foreground"}
                  strokeWidth={3}
                />
                <text x={xOf(i)} y={Y_MERGED + 28} textAnchor="middle" className="fill-foreground text-[10.5px]">
                  {note}
                </text>
              </g>
            );
          })}
          {/* Gate markers on the feature track's product layer and intake */}
          {[0, 1].map((i) => (
            <circle key={`g${i}`} cx={xOf(i)} cy={Y_FEATURE} r={3.5} className="fill-red-500" />
          ))}

          {/* Legend */}
          <g transform="translate(60 214)">
            <rect width={18} height={5} y={-4} rx={2} className="fill-violet-500" />
            <text x={24} y={0} className="fill-muted-foreground text-[11px]">
              Feature: CSV export (#412)
            </text>
            <rect x={200} width={18} height={5} y={-4} rx={2} className="fill-red-500" />
            <text x={224} y={0} className="fill-muted-foreground text-[11px]">
              Bug: double discount (#418)
            </text>
            <circle cx={420} cy={-1.5} r={5} className="fill-red-500" />
            <text x={430} y={0} className="fill-muted-foreground text-[11px]">
              stop with an approval gate
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="text-sm text-muted-foreground">
        Two different starts, one shared finish: every change goes through the same review, the same QA gate and the
        same merge. Scroll sideways on a small screen.
      </figcaption>
    </figure>
  );
}
