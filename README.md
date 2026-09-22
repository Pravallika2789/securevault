# 🔐 SecureVault

### Secure File Encryption & Decryption using AES-256-CBC

SecureVault is a secure file encryption and decryption prototype designed to protect sensitive files from unauthorized access.

The application uses **AES-256-CBC** for file confidentiality, **PBKDF2-HMAC-SHA256** for secure password-based key derivation, randomly generated **salt and initialization vectors (IVs)**, and **HMAC-SHA256** for integrity verification.

The project consists of a **React + Vite frontend** and a **Java Spring Boot backend** that communicates through REST APIs.

---

## ✨ Features

- 🔒 AES-256-CBC file encryption
- 🔓 Secure file decryption
- 🔑 Password-based key derivation using PBKDF2-HMAC-SHA256
- 🧂 Random salt generation
- 🎲 Random IV generation for every encryption operation
- 🛡️ HMAC-SHA256 integrity verification
- 🚫 Detection of incorrect passwords
- ⚠️ Detection of modified/tampered encrypted files
- 📁 File upload and encrypted file generation
- 📥 Download encrypted and decrypted files
- 🌐 React + Vite web interface
- ☕ Java Spring Boot backend
- 🔗 REST API communication

---

## 🧠 How SecureVault Works

SecureVault follows a layered cryptographic workflow.

```text
                User
                 │
                 ▼
        ┌─────────────────┐
        │ Select File     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Enter Password  │
        └────────┬────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │ Generate Random Salt │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ PBKDF2-HMAC-SHA256   │
        │ Key Derivation       │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Generate Random IV   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ AES-256-CBC Encrypt  │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ HMAC-SHA256          │
        │ Integrity Protection │
        └──────────┬───────────┘
                   │
                   ▼
             Encrypted File
