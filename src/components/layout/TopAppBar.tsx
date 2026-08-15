import { Icon } from "@/components/ui/Icon";
import type { NotificationAlert } from "@/lib/notifications";
import { NotificationsPanel } from "./NotificationsPanel";

export function TopAppBar({ alerts }: { alerts: NotificationAlert[] }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-pebble-mist/80 px-margin-mobile backdrop-blur md:px-margin-desktop">
      <span className="font-display-lg text-[22px] font-bold leading-tight text-sangria-deep md:hidden">
        Nivo
      </span>
      <div className="hidden md:block" aria-hidden="true" />
      <div className="flex items-center gap-2">
        <NotificationsPanel alerts={alerts} />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant">
          <Icon name="person" />
        </div>
      </div>
    </header>
  );
}