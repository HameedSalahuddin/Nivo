import { Icon } from "@/components/ui/Icon";

export function TopAppBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-pebble-mist/80 px-margin-mobile backdrop-blur md:px-margin-desktop">
      <span className="font-display-lg text-[22px] font-bold leading-tight text-sangria-deep md:hidden">
        Nivo
      </span>
      <div className="hidden md:block" aria-hidden="true" />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="Notifications"
        >
          <Icon name="notifications" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant">
          <Icon name="person" />
        </div>
      </div>
    </header>
  );
}