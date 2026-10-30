## 🔐 Environment Credentials Setup

This guide walks you through obtaining and configuring every secret VirtualFit needs to run. Create a file named `.env.local` in your project root and fill it in as you go.

> **⚠️ Never commit `.env.local` to Git.** Add it to `.gitignore` if it is not already there.

---

### 1. MongoDB (`MONGODB_URI`)

**What it is:** A connection string that tells your app (and the Auth.js adapter) how to reach your MongoDB database. You have two options: a free cloud database (Atlas) or a local instance.

#### Option A — MongoDB Atlas (Free Cloud) — *Recommended for production*

MongoDB Atlas's **M0 free tier** provides 512 MB of storage with no credit card required — more than enough for development and a small production app.

**Steps:**

1. **Create an account:** Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up.
2. **Create a free cluster:** Click **Build a Database** → select the **M0 Free tier** → choose a cloud provider and region → name your cluster → **Create Deployment**. Provisioning takes 1–3 minutes.
3. **Create a database user:** You will be prompted to set a **username** and a **strong password**. Save this password — you will need it for the connection string. Avoid special characters like `@`, `:`, or `/` as they require URL encoding.
4. **Whitelist your IP:** Go to **Network Access** → **Add IP Address**. For development, choose **Allow Access from Anywhere** (`0.0.0.0/0`).
5. **Get your connection string:** Go to **Database** → click **Connect** on your cluster → **Drivers** → select **Node.js** → copy the connection string. It looks like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
6. **Form your final URI:** Replace `<username>` and `<password>` with your database credentials, and insert the database name `virtualfit` after the host and before the `?`:

   ```env
   MONGODB_URI=mongodb+srv://yourUser:yourPassword@cluster0.xxxxx.mongodb.net/virtualfit?retryWrites=true&w=majority&appName=Cluster0
   ```

#### Option B — Local MongoDB — *Best for development*

If you already have MongoDB running locally (e.g., via Homebrew), use a local connection string. No username or password is needed by default.

```env
MONGODB_URI=mongodb://localhost:27017/virtualfit
```

The `/virtualfit` part is the database name; MongoDB will create it automatically on the first write.

> **Important:** The same `MONGODB_URI` is used by both `src/lib/mongodb.ts` (for the Auth.js adapter) and `src/lib/db/connect.ts` (for Mongoose). Keep them pointing to the same database, or users and clothing data will be split across two databases.

---

### 2. Auth Secret (`AUTH_SECRET`)

**What it is:** A cryptographically random string used by Auth.js to **sign and verify JWTs**, **encrypt session cookies**, and **verify CSRF tokens**. If the secret changes, all existing sessions become invalid. It must be at least 32 bytes (256 bits) of random data.

**How to generate it:**

You have several options. Choose one and run the command in your terminal.

| Method | Command |
|---|---|
| **OpenSSL** (recommended) | `openssl rand -base64 32` |
| **Auth.js CLI** (v5) | `npx auth secret` |
| **Node.js** (if OpenSSL isn't available) | `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |

The OpenSSL command generates 32 random bytes and base64-encodes them — exactly what Auth.js expects.

**Set it in `.env.local`:**

```env
AUTH_SECRET=<paste the generated string here>
```

> **Do not** use a human-readable passphrase like `my-super-secret-key`. It must be cryptographically random. In Auth.js v5, the variable is `AUTH_SECRET` (the old `NEXTAUTH_SECRET` is only kept for backward compatibility).

You also need:

```env
AUTH_URL=http://localhost:3000
```

This tells Auth.js the base URL for redirects and cookie domains.

---

### 3. UploadThing Token (`UPLOADTHING_TOKEN`)

**What it is:** In UploadThing v7, the old `UPLOADTHING_SECRET` has been replaced by a single `UPLOADTHING_TOKEN`. This token is a **base64-encoded JSON object** that contains your app ID, app region, and API key — everything the SDK needs to generate presigned upload URLs.

**How to get it:**

1. **Sign up / log in:** Go to [uploadthing.com](https://uploadthing.com/) and create a free account.
2. **Create an app:** In your dashboard, create a new app.
3. **Get the token:** Navigate to the **API Keys** section of your app's dashboard and make sure you are on the **V7** tab. Copy the token. It will look like `ut_xxx` or a longer base64 string.

**Set it in `.env.local`:**

```env
UPLOADTHING_TOKEN=your_token_here
```

> **Troubleshooting:** If your uploads fail with an "Upload returned no URL" error, double-check that the token is from the **V7** tab, not an older secret key. The token format changed in v7.

---

### 4. Replicate API Token (`REPLICATE_API_TOKEN`)

**What it is:** A bearer token that authorizes your app to run AI models (like IDM-VTON for try-on and LLaVA for tagging) on Replicate's cloud infrastructure.

**How to get it:**

1. **Sign up / log in:** Go to [replicate.com](https://replicate.com) and create an account.
2. **Navigate to API tokens:** Go directly to [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) (or click your avatar → **Account settings** → **API Tokens**).
3. **Create a token:** Click **Create a new API token** (or copy the default one). **Copy the token immediately** — it will start with `r8_` and is only shown once.

**Set it in `.env.local`:**

```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Important:** Replicate is a prepaid service. IDM-VTON costs approximately **$0.024 per run**. If your account has no remaining credit, every API call will fail with `402 Payment Required`. Add credit at [replicate.com/account/billing](https://replicate.com/account/billing) before testing try-ons.

---

### ✅ Complete `.env.local` Template

After following all four sections, your `.env.local` should look like this:

```env
# MongoDB — choose ONE of the two options below
# Option A: Local MongoDB (development)
MONGODB_URI=mongodb://localhost:27017/virtualfit

# Option B: MongoDB Atlas (production)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/virtualfit?retryWrites=true&w=majority&appName=Cluster0

# Auth.js
AUTH_SECRET=<your generated 32-byte random string>
AUTH_URL=http://localhost:3000

# UploadThing (v7 token)
UPLOADTHING_TOKEN=ut_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Replicate
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 🚀 Verify Your Setup

Once your `.env.local` is filled in, run the development server:

```bash
pnpm dev
```

If everything is configured correctly, you will see:

```
▲ Next.js 16.4.3 (Turbopack)
- Local:  http://localhost:3000
✓ Ready in ...
```

Navigate to `http://localhost:3000/register`, create an account, and upload a clothing item. If the item appears with AI-generated tags, all four credentials are working together correctly.

---

### 🛠️ Quick Troubleshooting

| Error | Likely cause | Fix |
|---|---|---|
| `MongooseServerSelectionError` | MongoDB isn't running (local) or IP not whitelisted (Atlas) | Start `mongod` or whitelist `0.0.0.0/0` |
| `Missing environment variable: "MONGODB_URI"` | `.env.local` not created or variable not named exactly | Ensure the file is `.env.local` (not `.env`) and restart `pnpm dev` |
| `Auth.js: Missing secret` | `AUTH_SECRET` is empty or too short | Regenerate with `openssl rand -base64 32` |
| `Upload returned no URL` | UploadThing token is from the wrong tab (v6, not v7) | Copy the token from the **V7** tab in the dashboard |
| `402 Payment Required` from Replicate | No credit in your Replicate account | Add credit at [replicate.com/account/billing](https://replicate.com/account/billing) |
| `Can't resolve 'mongodb'` | `mongodb` package not installed | Run `pnpm add mongodb` |

---

### 🔒 Security Checklist

- [ ] `.env.local` is listed in `.gitignore`
- [ ] `AUTH_SECRET` is at least 32 random bytes (not a passphrase)
- [ ] Replicate token is stored only in env vars, never in source code
- [ ] Production deploy (Vercel, etc.) uses a **different** `MONGODB_URI` (Atlas) than local development
- [ ] Production deploy sets all four env vars in the platform's dashboard, not in `.env.local`
- [ ] Atlas database user has a strong password and is not reused from any other service