import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { FileInfoCard } from "@/components/FileInfoCard";
import { PasswordInput } from "@/components/PasswordInput";
import { PasswordStrength } from "@/components/PasswordStrength";
import { EncryptionStatus } from "@/components/EncryptionStatus";
import { SuccessCard } from "@/components/SuccessCard";
import { ErrorCard } from "@/components/ErrorCard";
import { ApiError, MAX_FILE_SIZE, downloadResult, encryptFile, type NamedBlob } from "@/lib/api";
import { formatFileSize } from "@/lib/format";

const title = "Encrypt File — SecureVault";
const description = "Encrypt any file with AES-256-CBC using a password-derived key.";

export const Route = createFileRoute("/encrypt")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: EncryptPage,
});

function EncryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: NamedBlob; originalName: string } | null>(null);

  const selectFile = (selected: File) => {
    setError(null);
    setResult(null);
    if (selected.size === 0) {
      setError("This file is empty. Choose a file that contains data.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError(`This file is too large. The maximum supported size is ${formatFileSize(MAX_FILE_SIZE)}.`);
      return;
    }
    setFile(selected);
  };

  const reset = () => {
    setFile(null);
    setPassword("");
    setConfirmPassword("");
    setResult(null);
    setError(null);
  };

  const handleEncrypt = async () => {
    setError(null);

    if (!file) {
      setError("Select a file to encrypt before continuing.");
      return;
    }
    if (!password) {
      setError("Enter an encryption password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match. Re-enter them and try again.");
      return;
    }

    setBusy(true);
    try {
      const encrypted = await encryptFile(file, password);
      setResult({ blob: encrypted, originalName: file.name });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "An unexpected error occurred while encrypting the file. Please try again.",
      );
    } finally {
      // Passwords are cleared from component state once the operation finishes.
      setPassword("");
      setConfirmPassword("");
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Operation"
        title="Encrypt File"
        description="Encrypt a file using AES-256-CBC."
      />

      <div className="mt-8 space-y-6">
        {error && <ErrorCard message={error} onDismiss={() => setError(null)} />}

        {result ? (
          <SuccessCard
            title="Encryption Successful"
            details={[
              { label: "Original filename", value: result.originalName },
              { label: "Encrypted filename", value: result.blob.name },
              { label: "Algorithm", value: "AES-256-CBC" },
              { label: "Key derivation", value: "PBKDF2-HMAC-SHA256" },
              { label: "Integrity", value: "HMAC-SHA256" },
            ]}
            downloadLabel="Download Encrypted File"
            onDownload={() => downloadResult(result.blob)}
            resetLabel="Encrypt Another File"
            onReset={reset}
          />
        ) : (
          <>
            {file ? (
              <FileInfoCard file={file} disabled={busy} onRemove={() => setFile(null)} />
            ) : (
              <FileDropzone
                title="Drop your file here"
                subtitle="or browse from your computer"
                disabled={busy}
                onSelect={selectFile}
              />
            )}

            <section className="panel space-y-5 p-6">
              <h2 className="text-base font-semibold">Encryption Password</h2>
              <PasswordInput
                label="Encryption Password"
                value={password}
                onChange={setPassword}
                disabled={busy}
              />
              <PasswordStrength password={password} />
              <PasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Re-enter password"
                disabled={busy}
                error={
                  confirmPassword && confirmPassword !== password ? "Passwords do not match." : undefined
                }
              />
              <p className="flex items-start gap-2 rounded-md border border-border bg-surface/70 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                Your password is never displayed or stored by the application.
              </p>
            </section>

            {busy ? (
              <EncryptionStatus
                message="Encrypting file..."
                detail="Deriving key with PBKDF2 and applying AES-256-CBC on the server."
              />
            ) : (
              <button
                type="button"
                onClick={handleEncrypt}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                <Lock className="size-4" aria-hidden />
                Encrypt File
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
