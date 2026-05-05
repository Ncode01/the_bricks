import { cn } from "@/lib/utils";

export type PanelTab = {
  label: string;
  active?: boolean;
  tone?: "violet" | "lavender" | "cyan";
};

export type PanelTool = {
  label: string;
  value?: string;
  tone?: "muted" | "cyan";
};

const tabTone: Record<NonNullable<PanelTab["tone"]>, string> = {
  violet: "border-violet/40 text-ink",
  lavender: "border-lavender/40 text-ink",
  cyan: "border-cyan/40 text-ink"
};

export function PanelShell({
  title,
  meta,
  status,
  tabs,
  tools,
  children,
  footer,
  className,
  bodyClassName
}: {
  title: string;
  meta?: string;
  status?: string;
  tabs?: PanelTab[];
  tools?: PanelTool[];
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={cn("panel relative flex flex-col", className)}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <span className="panel-dot" />
          <span className="label-tech text-ink-muted">{title}</span>
          {status ? <span className="panel-status">{status}</span> : null}
        </div>
        {tabs?.length ? (
          <div className="panel-tabs">
            {tabs.map((tab) => (
              <span
                key={tab.label}
                className={cn(
                  "panel-tab",
                  tab.active && "panel-tab-active",
                  tab.tone ? tabTone[tab.tone] : ""
                )}
              >
                {tab.label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="panel-tools">
          {tools?.map((tool) => (
            <span
              key={tool.label}
              className={cn(
                "panel-tool",
                tool.tone === "cyan" && "panel-tool-active"
              )}
            >
              {tool.value ? `${tool.label} ${tool.value}` : tool.label}
            </span>
          ))}
          {meta ? <span className="label-tech text-ink-muted">{meta}</span> : null}
        </div>
      </div>
      <div className={cn("panel-body p-3", bodyClassName)}>{children}</div>
      {footer ? <div className="panel-footer">{footer}</div> : null}
      <span className="panel-resize" aria-hidden="true" />
    </div>
  );
}
