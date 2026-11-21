import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <section className="w-full max-w-[460px]">
      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-2 md:p-8">
        <div className="mb-6 flex flex-col gap-1.5">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Reset your password
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Enter the email for your Nivo account and we’ll send you a reset link.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-sangria-deep"
        >
          Back to <span className="font-semibold text-sangria-deep">Log in</span>
        </Link>
      </div>
    </section>
  );
}
