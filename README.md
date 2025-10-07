# Password Generator + Secure Vault (MVP)

A fast, simple, privacy-first web app to generate strong passwords and securely store them in a personal vault.  

This project is built as a Minimum Viable Product (MVP) for managing passwords safely and efficiently.

---

## 🌟 Features

### Must-Have
- **Password Generator**
  - Adjustable length slider
  - Include numbers, letters, symbols
  - Option to exclude look-alike characters
- **Simple Authentication**
  - Email + password registration/login
- **Vault Items**
  - Fields: title, username, password, URL, notes
  - Client-side encryption ensures server never stores plaintext
- **Copy to Clipboard**
  - Automatically clears after ~10–20 seconds
- **Search/Filter**
  - Quickly find saved items

### Nice-to-Have (Optional)
- Two-Factor Authentication (TOTP)
- Tags / Folders
- Dark Mode
- Export/Import (encrypted file)

---

## 💻 Tech Stack

- **Frontend:** Next.js (React) with TypeScript  
- **Backend:** Next.js API routes or Node.js  
- **Database:** MongoDB  
- **Security:** JWT for authentication, AES (or chosen crypto library) for client-side encryption  

---

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/Sejal26-web/PasswordGeneratorwithVault.git
cd PasswordGeneratorwithVault
