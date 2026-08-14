import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

interface BranchNodeProps {
  icon: string;
  label: string;
  amount: string;
  iconBg: string;
  iconColor: string;
  delay: string;
  style: CSSProperties;
}

function BranchNode({
  icon,
  label,
  amount,
  iconBg,
  iconColor,
  delay,
  style,
}: BranchNodeProps) {
  return (
    <div
      className="animate-float-up absolute z-20"
      style={{ ...style, animationDelay: delay }}
    >
      <div className="flex items-center gap-3 rounded-xl border border-pebble-mist bg-surface p-4 shadow-sm">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <div className="font-label-sm text-label-sm text-on-surface-variant">
            {label}
          </div>
          <div className="font-title-md text-[18px] text-on-surface">{amount}</div>
        </div>
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
      <header className="relative z-10 w-full bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-margin-mobile py-4 md:px-margin-desktop">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Nivo logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="font-display-lg text-[24px] font-bold leading-tight text-sangria-deep">
              Nivo
            </span>
          </div>
          <Link
            href="/login"
            className="hidden rounded-full bg-surface-container-low px-6 py-2 font-label-sm text-label-sm font-semibold text-sangria-deep transition-colors hover:bg-surface-container md:inline-block"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-grow items-center px-margin-mobile py-12 md:px-margin-desktop">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-low px-4 py-1.5">
                <span className="material-symbols-outlined text-sm text-jade-botanical">
                  trending_up
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Student Finance
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg tracking-tight text-on-surface md:text-[56px] md:leading-[64px]">
                Make your money work for you.
              </h1>
              <p className="max-w-md font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
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
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/login"
                className="group flex items-center gap-1 font-title-md text-[16px] text-on-surface-variant transition-colors hover:text-sangria-deep"
              >
                Already have an account?{" "}
                <span className="group-hover:underline">Log in</span>
              </Link>
            </div>
          </div>

          <div className="relative flex h-[480px] w-full items-center justify-center md:h-[560px]">
            <div className="glass-panel absolute left-1/2 top-1/2 z-20 flex min-w-[200px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl p-6">
              <span className="mb-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                Monthly Allowance
              </span>
              <span className="font-display-lg text-[36px] text-sangria-deep">
                ₹ 25,000
              </span>
            </div>
            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className="animate-connector"
                d="M 50 50 L 20 20"
                fill="none"
                stroke="#E4EAE8"
                strokeWidth="2"
                style={{ animationDelay: "0.1s" }}
              />
              <path
                className="animate-connector"
                d="M 50 50 L 80 20"
                fill="none"
                stroke="#E4EAE8"
                strokeWidth="2"
                style={{ animationDelay: "0.3s" }}
              />
              <path
                className="animate-connector"
                d="M 50 50 L 20 80"
                fill="none"
                stroke="#E4EAE8"
                strokeWidth="2"
                style={{ animationDelay: "0.5s" }}
              />
              <path
                className="animate-connector"
                d="M 50 50 L 80 80"
                fill="none"
                stroke="#E4EAE8"
                strokeWidth="2"
                style={{ animationDelay: "0.7s" }}
              />
            </svg>
            <BranchNode
              icon="menu_book"
              label="Studies"
              amount="₹ 5,000"
              iconBg="bg-secondary-container"
              iconColor="text-on-secondary-container"
              delay="0.2s"
              style={{ top: "10%", left: "10%" }}
            />
            <BranchNode
              icon="home"
              label="Essentials"
              amount="₹ 10,000"
              iconBg="bg-tertiary-container"
              iconColor="text-on-tertiary-container"
              delay="0.4s"
              style={{ top: "10%", right: "10%" }}
            />
            <BranchNode
              icon="local_mall"
              label="Shopping"
              amount="₹ 6,000"
              iconBg="bg-surface-variant"
              iconColor="text-on-surface-variant"
              delay="0.6s"
              style={{ bottom: "10%", left: "10%" }}
            />
            <BranchNode
              icon="celebration"
              label="Fun"
              amount="₹ 4,000"
              iconBg="bg-primary-container"
              iconColor="text-on-primary-container"
              delay="0.8s"
              style={{ bottom: "10%", right: "10%" }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}