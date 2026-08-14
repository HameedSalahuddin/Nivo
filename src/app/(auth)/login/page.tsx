import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <section className="w-full max-w-[460px]">
      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-2 md:p-8">
        <div className="mb-6 flex flex-col gap-1.5">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Welcome back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage your allowance with Nivo.
          </p>
        </div>
        <LoginForm />
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/signup"
          className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-sangria-deep"
        >
          Don&apos;t have an account?{" "}
          <span className="font-semibold text-sangria-deep">Sign up</span>
        </Link>
      </div>
    </section>
  );
}