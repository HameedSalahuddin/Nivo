import Link from "next/link";
import { SvgIcon, type SvgIconName } from "@/components/ui/SvgIcon";

interface BranchCardProps {
  icon: SvgIconName;
  label: string;
  amount: string;
  iconBg: string;
  iconColor: string;
}

function BranchCard({ icon, label, amount, iconBg, iconColor }: BranchCardProps) {
  return (
    <div className="animate-float-up flex items-center gap-3 rounded-xl border border-pebble-mist bg-surface p-3 shadow-sm">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
      >
        <SvgIcon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="font-label-sm text-label-sm text-on-surface-variant">{label}</div>
        <div className="font-title-md text-[16px] text-on-surface">{amount}</div>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface-bright text-on-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/3 rounded-full bg-secondary-fixed-dim/20 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-0 h-[600px] w-[600px] -translate-x-1/4 translate-y-1/3 rounded-full bg-primary-fixed-dim/10 blur-[100px]"
      />

      <header className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
          <span className="font-display-lg text-[24px] font-bold leading-tight text-sangria-deep">
            Nivo
          </span>
          <Link
            href="/login"
            className="hidden rounded-full bg-surface-container-low px-6 py-2 font-label-sm text-label-sm font-semibold text-sangria-deep transition-colors hover:bg-surface-container md:inline-block"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-margin-mobile py-12 md:px-margin-desktop">
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-8">
          <section className="flex min-w-0 flex-col items-start gap-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-1.5">
              <SvgIcon name="trend" className="h-4 w-4 text-jade-botanical" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Student Finance
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="font-display-lg text-[40px] leading-[48px] tracking-tight text-on-surface md:text-[54px] md:leading-[62px]">
                Make your money
                <br />
                work for you.
              </h1>
              <p className="max-w-[460px] font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                Nivo helps you plan your allowance, track your spending, and know
                exactly where your money goes.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-full bg-sangria-deep px-8 py-3 font-title-md text-[16px] text-white shadow-lg shadow-sangria-deep/20 transition-all duration-200 hover:bg-primary active:scale-95"
              >
                Get started
                <SvgIcon name="arrow_forward" className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="group flex items-center gap-1 font-title-md text-[16px] text-on-surface-variant transition-colors hover:text-sangria-deep"
              >
                Already have an account?{" "}
                <span className="group-hover:underline">Log in</span>
              </Link>
            </div>
          </section>

          <section className="relative flex w-full items-center justify-center">
            <div className="relative flex w-full max-w-md flex-col items-center gap-5 py-8">
              <svg
                className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="animate-connector"
                  d="M 50 50 L 25 12"
                  fill="none"
                  stroke="#E4EAE8"
                  strokeWidth="2"
                  style={{ animationDelay: "0.1s" }}
                />
                <path
                  className="animate-connector"
                  d="M 50 50 L 75 12"
                  fill="none"
                  stroke="#E4EAE8"
                  strokeWidth="2"
                  style={{ animationDelay: "0.3s" }}
                />
                <path
                  className="animate-connector"
                  d="M 50 50 L 25 88"
                  fill="none"
                  stroke="#E4EAE8"
                  strokeWidth="2"
                  style={{ animationDelay: "0.5s" }}
                />
                <path
                  className="animate-connector"
                  d="M 50 50 L 75 88"
                  fill="none"
                  stroke="#E4EAE8"
                  strokeWidth="2"
                  style={{ animationDelay: "0.7s" }}
                />
              </svg>

              <div className="relative z-10 grid w-full grid-cols-2 gap-4">
                <BranchCard
                  icon="book"
                  label="Studies"
                  amount="₹ 5,000"
                  iconBg="bg-secondary-container"
                  iconColor="text-on-secondary-container"
                />
                <BranchCard
                  icon="home"
                  label="Essentials"
                  amount="₹ 10,000"
                  iconBg="bg-tertiary-container"
                  iconColor="text-on-tertiary-container"
                />
              </div>

              <div className="glass-panel relative z-10 flex flex-col items-center justify-center rounded-2xl px-8 py-6 text-center">
                <span className="mb-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Monthly Allowance
                </span>
                <span className="font-display-lg text-[36px] text-sangria-deep">
                  ₹ 25,000
                </span>
              </div>

              <div className="relative z-10 grid w-full grid-cols-2 gap-4">
                <BranchCard
                  icon="bag"
                  label="Shopping"
                  amount="₹ 6,000"
                  iconBg="bg-surface-variant"
                  iconColor="text-on-surface-variant"
                />
                <BranchCard
                  icon="gift"
                  label="Fun"
                  amount="₹ 4,000"
                  iconBg="bg-primary-container"
                  iconColor="text-on-primary-container"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}