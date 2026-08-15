import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { signOut } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const verified = Boolean(user.email_confirmed_at);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-sangria-deep"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          Settings
        </Link>
        <h1 className="mt-2 font-headline-lg text-headline-lg text-on-surface">
          Account
        </h1>
      </div>

      <Card className="p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-title-md text-title-md text-on-surface">
              Profile
            </h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Your account information.
            </p>
          </div>

          <dl className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="font-label-sm text-label-sm text-on-surface-variant">
                Email
              </dt>
              <dd className="min-w-0 break-all text-right font-body-md text-body-md text-on-surface">
                {user.email}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="font-label-sm text-label-sm text-on-surface-variant">
                Status
              </dt>
              <dd className="font-body-md text-body-md text-on-surface">
                {verified ? "Email verified" : "Email not verified"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="font-label-sm text-label-sm text-on-surface-variant">
                Member since
              </dt>
              <dd className="font-body-md text-body-md text-on-surface">
                {formatDate(user.created_at)}
              </dd>
            </div>
          </dl>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-title-md text-title-md text-on-surface">
              Actions
            </h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Sign out of Nivo on this device.
            </p>
          </div>

          <form action={signOut}>
            <Button type="submit" variant="outline" fullWidth>
              <Icon name="logout" className="text-[18px]" />
              Sign out
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
