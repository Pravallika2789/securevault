import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Unlock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { FileDropzone } from "@/components/FileDropzone";
import { FileInfoCard } from "@/components/FileInfoCard";
import { PasswordInput } from "@/components/PasswordInput";
import { EncryptionStatus } from "@/components/EncryptionStatus";
import { SuccessCard } from "@/components/SuccessCard";
import { ErrorCard } from "@/components/ErrorCard";
import {
  ApiError,
  ENCRYPTED_EXTENSION,
  MAX_FILE_SIZE,
  decryptFile,
  downloadResult,
  type NamedBlob,
} from "@/lib/api";
import { formatFileSize } from "@/lib/format";

const title = "Decrypt File — SecureVault";
const description = "Restore a SecureVault .enc file after HMAC-SHA256 integrity verification.";

export const Route = createFileRoute("/decrypt")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: DecryptPage,
});

function DecryptPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [result, setResult] = useState<{ blob: NamedBlob; encryptedName: string } | null>(null);

  const selectFile = (selected: File) => {
    setError(null);
    setResult(null);
    if (!selected.name.toLowerCase().endsWith(ENCRYPTED_EXTENSION)) {
      setError({
        title: "Invalid encrypted file",
        message: "SecureVault can only decrypt files with the .enc extension.",
      });
      return;
    }
    if (selected.size === 0) {
      setError({ title: "Invalid encrypted file", message: "This file is empty." });
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setError({
        title: "File too large",
        message: `The maximum supported size is ${formatFileSize(MAX_FILE_SIZE)}.`,
      });
      return;
    }
    setFile(selected);
  };

  const reset = () => {
    setFile(null);
    setPassword("");
    setResult(null);
    setError(null);
  };

  const handleDecrypt = async () => {
    setError(null);

    if (!file) {
      setError({ title: "No file selected", message: "Select a .enc file to decrypt." });
      return;
    }
    if (!password) {
      setError({ title: "Password required", message: "Enter the password used to encrypt this file." });
      return;
    }

    setBusy(true);
    try {
      const decrypted = await decryptFile(file, password);
      setResult({ blob: decrypted, encryptedName: file.name });
    } catch (err) {
      if (err instanceof ApiError && err.kind === "auth") {
        // Ambiguous by design: never disclose whether the password or the
        // integrity check failed.
        setError({ title: "Decryption Failed", message: err.message });
      } else {
        setError({
          title: "Decryption Failed",
          message:
            err instanceof ApiError
              ? err.message
              : "An unexpected error occurred while decrypting the file. Please try again.",
        });
      }
    } finally {
      // Password is cleared from component state once the operation finishes.
      setPassword("");
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Operation"
        title="Decrypt File"
        description="Decrypt a SecureVault encrypted file."
      />

      <div className="mt-8 space-y-6">
        {error && <ErrorCard title={error.title} message={error.message} onDismiss={() => setError(null)} />}

        {result ? (
          <SuccessCard
            title="Decryption Successful"
            details={[
              { label: "Encrypted filename", value: result.encryptedName },
              { label: "Recovered filename", value: result.blob.name },
              { label: "Integrity check", value: "HMAC-SHA256 verified" },
            ]}
            downloadLabel="Download Decrypted File"
            onDownload={() => downloadResult(result.blob)}
            resetLabel="Decrypt Another File"
            onReset={reset}
          />
        ) : (
          <>
            {file ? (
              <FileInfoCard file={file} disabled={busy} onRemove={() => setFile(null)} />
            ) : (
              <FileDropzone
                title="Drop your .enc file here"
                subtitle="or browse from your computer"
                accept=".enc"
                disabled={busy}
                onSelect={selectFile}
              />
            )}

            <section className="panel space-y-5 p-6">
              <h2 className="text-base font-semibold">Decryption Password</h2>
              <PasswordInput
                label="Password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
                disabled={busy}
              />
              <p className="text-xs text-muted-foreground">
                Your password is never displayed or stored by the application.
              </p>
            </section>

            {busy ? (
              <EncryptionStatus
                message="Verifying and decrypting..."
                detail="Checking HMAC-SHA256 integrity before AES-CBC decryption."
              />
            ) : (
              <button
                type="button"
                onClick={handleDecrypt}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                <Unlock className="size-4" aria-hidden />
                Decrypt File
              </button>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
