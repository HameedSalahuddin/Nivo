import Image from "next/image";

export function TopAppBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-pebble-mist/80 px-margin-mobile backdrop-blur md:px-margin-desktop">
      <Image
        src="/logo.png"
        alt="Nivo logo"
        width={32}
        height={32}
        className="h-8 w-8 rounded-md object-contain md:hidden"
      />
      <div className="hidden md:block" aria-hidden="true" />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
        </div>
      </div>
    </header>
  );
}