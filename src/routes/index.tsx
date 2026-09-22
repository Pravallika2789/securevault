import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint, KeySquare, Lock, ShieldCheck, Shuffle, Unlock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DashboardCard } from "@/components/DashboardCard";
import { SecurityBadge } from "@/components/SecurityBadge";

const title = "SecureVault — AES-256-CBC Secure File Encryption";
const description =
  "Protect sensitive files with AES-256-CBC encryption, PBKDF2-HMAC-SHA256 key derivation and HMAC-SHA256 integrity verification.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <section className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
          <ShieldCheck className="size-3.5" aria-hidden />
          Information Assurance &amp; Security
        </p>
        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">Secure File Protection</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Protect sensitive files using AES-256-CBC encryption.
        </p>
      </section>

      <section className="mt-10 grid gap-5 sm:grid-cols-2">
        <DashboardCard
          icon={Lock}
          title="Encrypt a File"
          description="Convert your file into protected encrypted data."
          action="Start Encryption"
          to="/encrypt"
        />
        <DashboardCard
          icon={Unlock}
          title="Decrypt a File"
          description="Restore an encrypted file using your password."
          action="Start Decryption"
          to="/decrypt"
        />
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold">Security technology</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SecurityBadge icon={Lock} title="AES-256-CBC" description="Confidentiality" />
          <SecurityBadge
            icon={KeySquare}
            title="PBKDF2-HMAC-SHA256"
            description="Password-based key derivation"
          />
          <SecurityBadge icon={Fingerprint} title="HMAC-SHA256" description="Integrity verification" />
          <SecurityBadge icon={Shuffle} title="Random Salt + IV" description="Cryptographic randomization" />
        </div>
      </section>
    </AppShell>
  );
}
