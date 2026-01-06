# 🖥️ Coolify CLI Guide - Read Configuration via Command Line

## ✅ What I Found

Coolify has a **Command Line Interface (CLI)** that lets you read configuration and manage deployments from the terminal!

---

## 📦 Installation

I've created a setup script. Run:

```bash
cd /Users/OceanCyber/Downloads/tourworld-fresh
./scripts/setup-coolify-cli.sh
```

Or install manually:

```bash
curl -fsSL https://raw.githubusercontent.com/coollabsio/coolify-cli/main/scripts/install.sh | bash
```

---

## 🔑 Step 1: Get API Token

To use the CLI, you need an API token from Coolify:

1. **Go to Coolify:** `http://31.97.57.75:8000`
2. **Click:** "Keys & Tokens" in the left sidebar
3. **Click:** "+ Add" to create a new API token
4. **Copy the token** (save it somewhere safe!)

---

## 🔐 Step 2: Login to Coolify CLI

After getting your API token, run:

```bash
coolify login http://31.97.57.75:8000
```

Enter your API token when prompted.

---

## 📋 Useful Commands

Once logged in, you can use:

### List Projects
```bash
coolify projects list
```

### List Applications
```bash
coolify applications list
```

### View Application Logs
```bash
coolify applications logs wastwagon/tourworldtourism:main-18okcwwccgo0gokwk0wc4ock
```

### View Application Configuration
```bash
coolify applications show wastwagon/tourworldtourism:main-18okcwwccgo0gokwk0wc4ock
```

### View Environment Variables
```bash
coolify applications env wastwagon/tourworldtourism:main-18okcwwccgo0gokwk0wc4ock
```

### Deploy Application
```bash
coolify applications deploy wastwagon/tourworldtourism:main-18okcwwccgo0gokwk0wc4ock
```

### Check Deployment Status
```bash
coolify deployments list
```

---

## 🎯 Quick Status Check

I've also created a script to check deployment status:

```bash
./scripts/check-coolify-status.sh
```

This checks:
- ✅ Coolify dashboard accessibility
- ✅ Application status (IP and domain)
- ✅ Database port status

---

## 📝 Current Status (from command line check)

- ✅ **Coolify Dashboard:** Accessible at `http://31.97.57.75:8000`
- ⏳ **Application:** Not deployed yet (needs deployment)
- ⏳ **Database:** Running internally (port 5432 not exposed externally - this is normal)

---

## 🚀 Next Steps

1. **Install CLI** (if not done): `./scripts/setup-coolify-cli.sh`
2. **Get API Token** from Coolify UI
3. **Login:** `coolify login http://31.97.57.75:8000`
4. **Check config:** `coolify applications show [your-app-name]`
5. **Deploy:** Use CLI or UI - both work!

---

## 💡 Benefits of Using CLI

- ✅ Read configuration quickly
- ✅ View logs without opening browser
- ✅ Deploy from terminal
- ✅ Automate deployments
- ✅ Check status anytime

---

## 🆘 Need Help?

If you get stuck:
1. Make sure CLI is installed: `which coolify`
2. Check if logged in: `coolify whoami`
3. Get help: `coolify --help`

**Try it out and let me know what you see!** 🚀

