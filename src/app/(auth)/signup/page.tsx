import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SignUpForm } from "./signup-form";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md rounded-2xl p-6 shadow-level-2 md:p-8">
      <div className="mb-6 flex flex-col gap-1.5">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Create your account
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Start managing your allowance with Nivo.
        </p>
      </div>
      <SignUpForm />
      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-sangria-deep"
        >
          Already have an account?{" "}
          <span className="font-semibold text-sangria-deep">Log in</span>
        </Link>
      </div>
    </Card>
  );
}