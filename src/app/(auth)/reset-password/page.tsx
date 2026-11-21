import Link from "next/link";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <section className="w-full max-w-[460px]">
      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-level-2 md:p-8">
        <div className="mb-6 flex flex-col gap-1.5">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Choose a new password
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Use at least 6 characters for your new password.
          </p>
        </div>
        <ResetPasswordForm />
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
