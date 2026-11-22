import { redirect } from "next/navigation";
import { signInWithMagicLink } from "@/app/admin/actions";
import SaveButton from "@/components/ui/SaveButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv, isAllowedAdminEmail } from "@/lib/supabase/config";
import { fieldClass } from "@/components/ui/field";

interface AdminLoginPageProps {
  searchParams: Promise<{
    sent?: string;
    error?: string;
    reason?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (user && isAllowedAdminEmail(user.email)) redirect("/admin");

  return (
    <main className="flex min-h-[calc(100dvh-var(--header-height))] items-center bg-bg px-4 py-12 text-ink">
      <div className="mx-auto w-full max-w-md rounded-tile border border-line bg-surface p-6">
        <h1 className="font-display text-3xl font-semibold">
          Portfolio CMS
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Sign in with an allowlisted email to manage projects, events,
          certifications, experience, skills, and site copy.
        </p>

        {!hasSupabasePublicEnv() ? (
          <p className="mt-5 rounded-tile border border-line bg-block-yellow p-4 text-sm text-on-block">
            Supabase public environment variables are missing.
          </p>
        ) : null}

        {params.sent ? (
          <p className="mt-5 rounded-tile border border-line bg-block-green p-4 text-sm text-on-block">
            Check your email for the login link.
          </p>
        ) : null}

        {params.error ? (
          <p className="mt-5 rounded-tile border border-line bg-block-orange p-4 text-sm text-on-block">
            {params.error === "forbidden" ? (
              "This email is not allowlisted for admin access."
            ) : params.error === "callback" ? (
              <>
                Unable to complete sign-in.
                {params.reason ? ` ${params.reason}` : " Please open the magic link in the same browser where you requested it."}
              </>
            ) : params.error === "signin" && params.reason === "redirect" ? (
              "Supabase rejected the callback URL. Confirm the Site URL and redirect URL, then redeploy."
            ) : params.error === "signin" && params.reason === "rate" ? (
              "Too many login links were requested. Please wait before trying again."
            ) : params.error === "signin" && params.reason === "email" ? (
              "Supabase could not send the email. Check the Auth email provider and SMTP settings."
            ) : (
              "Unable to sign in with the current Supabase configuration."
            )}
          </p>
        ) : null}

        <form action={signInWithMagicLink} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClass}
              placeholder="you@example.com"
            />
          </label>
          <SaveButton type="submit">Send magic link</SaveButton>
        </form>
      </div>
    </main>
  );
}
