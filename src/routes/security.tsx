import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint, KeySquare, Lock, Shuffle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";

const title = "Security Architecture — SecureVault";
const description =
  "How SecureVault combines AES-256-CBC, PBKDF2-HMAC-SHA256, random salt and IV, and HMAC-SHA256 integrity checks.";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SecurityPage,
});

const sections = [
  {
    icon: Lock,
    title: "AES-256-CBC",
    body: "AES is a symmetric block cipher: the same 256-bit key both encrypts and decrypts the data, and the plaintext is processed in fixed 128-bit blocks. Cipher Block Chaining (CBC) chains those blocks together — each plaintext block is XORed with the previous ciphertext block before encryption, so identical plaintext blocks never produce identical ciphertext.",
  },
  {
    icon: KeySquare,
    title: "PBKDF2",
    body: "A human password is not a cryptographic key. SecureVault converts the password into a 256-bit AES key using PBKDF2-HMAC-SHA256 with a freshly generated random salt and a high iteration count. The salt makes precomputed rainbow tables useless, and the iteration count makes brute-force guessing computationally expensive.",
  },
  {
    icon: Shuffle,
    title: "Random IV",
    body: "Every encryption operation generates a fresh, cryptographically random initialization vector for the first CBC block. Encrypting the same file twice with the same password therefore produces completely different ciphertext. The IV is not secret and is stored alongside the ciphertext so decryption can reproduce the chain.",
  },
  {
    icon: Fingerprint,
    title: "HMAC-SHA256",
    body: "Confidentiality alone does not prove authenticity. An HMAC-SHA256 tag is computed over the encrypted payload with a key derived from the same password material. On decryption the tag is recomputed and compared: if a single byte was altered, verification fails and decryption is refused before any plaintext is produced.",
  },
] as const;

const flow = [
  "Password",
  "PBKDF2 + Random Salt",
  "AES-256 Key",
  "AES-CBC Encryption",
  "Ciphertext",
  "HMAC-SHA256",
  "Encrypted .enc File",
];

function SecurityPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Architecture"
        title="Security Architecture"
        description="The cryptographic design behind SecureVault. Every operation described here runs on the backend service — no key material ever reaches the browser."
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <article key={section.title} className="panel p-6">
            <span className="flex size-10 items-center justify-center rounded-lg border border-primary/35 bg-primary/10 text-primary">
              <section.icon className="size-5" aria-hidden />
            </span>
            <h2 className="mt-4 font-mono text-base font-semibold">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </article>
        ))}
      </div>

      <section className="panel mt-10 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Security Flow</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          The order of operations for a single encryption request.
        </p>
        <ol className="mt-6 space-y-2">
          {flow.map((step, index) => (
            <li key={step} className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5">
                <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-mono text-sm">{step}</span>
              </div>
              {index < flow.length - 1 && (
                <span aria-hidden className="ml-6 text-primary">
                  ↓
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
