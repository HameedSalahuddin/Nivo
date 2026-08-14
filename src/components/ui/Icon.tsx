// Material Symbols Outlined (self-hosted subset). Icons render via their PUA
// codepoint directly, so they do not depend on font ligature substitution.
const ICON_CODEPOINTS: Record<string, string> = {
  account_balance_wallet: "\uE850",
  add: "\uE145",
  arrow_back: "\uE5C4",
  arrow_forward: "\uE5C8",
  category: "\uE574",
  celebration: "\uEA65",
  check_circle: "\uE86C",
  close: "\uE14C",
  dashboard: "\uE871",
  directions_bus: "\uE530",
  home: "\uE88A",
  local_mall: "\uE54C",
  lock: "\uE88D",
  mail: "\uE0BE",
  menu_book: "\uEA19",
  movie: "\uE02C",
  notifications: "\uE7F4",
  person: "\uE7FD",
  receipt_long: "\uEF6E",
  restaurant: "\uE56C",
  settings: "\uE8B8",
  shopping_bag: "\uF1CC",
  shopping_cart: "\uE547",
  subscriptions: "\uE064",
  trending_up: "\uE8E5",
};

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {ICON_CODEPOINTS[name] ?? name}
    </span>
  );
}