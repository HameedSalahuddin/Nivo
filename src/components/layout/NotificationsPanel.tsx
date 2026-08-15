"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { IconCircle } from "@/components/ui/IconCircle";
import type { NotificationAlert } from "@/lib/notifications";

interface NotificationsPanelProps {
  alerts: NotificationAlert[];
}

const SEVERITY_STYLES: Record<NotificationAlert["severity"], { icon: string; iconClass: string }> = {
  danger: { icon: "trending_up", iconClass: "bg-sangria-deep/10 text-sangria-deep" },
  warning: { icon: "trending_up", iconClass: "bg-sangria-deep/5 text-sangria-deep/70" },
  info: { icon: "account_balance_wallet", iconClass: "bg-surface-variant text-on-surface-variant" },
};

export function NotificationsPanel({ alerts }: NotificationsPanelProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={alerts.length > 0 ? `Notifications (${alerts.length})` : "Notifications"}
        className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
      >
        <Icon name="notifications" />
        {alerts.length > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sangria-deep px-1 text-[10px] font-semibold leading-none text-white">
            {alerts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2.5rem))] max-h-[70vh] overflow-y-auto rounded-xl border border-surface-variant bg-surface-container-lowest p-4 shadow-level-2">
          <p className="mb-2 font-title-md text-title-md text-on-surface">Notifications</p>
          {alerts.length === 0 ? (
            <div className="flex items-center gap-2 py-2">
              <Icon name="check_circle" className="text-[20px] text-jade-botanical" />
              <p className="font-body-md text-body-md text-on-surface-variant">
                You&apos;re all caught up.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {alerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-surface-container"
                >
                  <IconCircle
                    icon={SEVERITY_STYLES[alert.severity].icon}
                    size="sm"
                    className={SEVERITY_STYLES[alert.severity].iconClass}
                  />
                  <p className="min-w-0 font-body-md text-body-md text-on-surface">
                    {alert.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
