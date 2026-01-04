# 🖥️ VPS Deployment Guide for Tour World Tourism

## 📋 Current Status

### ✅ Completed
- ✅ Next.js 15 application fully built
- ✅ PostgreSQL database schema ready (Prisma)
- ✅ All API routes implemented
- ✅ Admin panel complete
- ✅ Frontend components ready
- ✅ Docker setup for local development
- ✅ Git repository configured
- ✅ All code committed and ready

### 📦 What's Ready to Deploy
- Complete Next.js application
- Prisma database schema
- All dependencies configured
- Environment variables documented

## 🚀 VPS Deployment Steps

### Prerequisites
- VPS with Ubuntu 20.04/22.04 or similar Linux distribution
- Root or sudo access
- Domain name (optional but recommended)
- SSH access configured

### Step 1: Initial VPS Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### Step 2: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE tourworld_tourism;
CREATE USER tourworld_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE tourworld_tourism TO tourworld_user;
ALTER USER tourworld_user CREATEDB;
\q
EOF
```

### Step 3: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd
# Follow the instructions it outputs
```

### Step 4: Clone Repository

```bash
# Create app directory
sudo mkdir -p /var/www
cd /var/www

# Clone your repository
sudo git clone https://github.com/wastwagon/tourworldtourism.git tourworld-tourism
cd tourworld-tourism

# Set ownership
sudo chown -R $USER:$USER /var/www/tourworld-tourism
```

### Step 5: Install Dependencies & Build

```bash
cd /var/www/tourworld-tourism

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Build the application
npm run build
```

### Step 6: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the following content:

```env
# Database
DATABASE_URL="postgresql://tourworld_user:your_secure_password_here@localhost:5432/tourworld_tourism"

# NextAuth
NEXTAUTH_SECRET="generate_with_openssl_rand_base64_32"
NEXTAUTH_URL="https://yourdomain.com"

# Node Environment
NODE_ENV="production"

# Port (optional, defaults to 3000)
PORT=3000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 7: Start Application with PM2

```bash
cd /var/www/tourworld-tourism

# Start the application
pm2 start npm --name "tourworld-tourism" -- start

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs tourworld-tourism
```

### Step 8: Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/tourworld-tourism
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/tourworld-tourism /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 9: Setup SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically update your Nginx config
# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 10: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

## 🔧 Maintenance Commands

### Application Management

```bash
# View application logs
pm2 logs tourworld-tourism

# Restart application
pm2 restart tourworld-tourism

# Stop application
pm2 stop tourworld-tourism

# View application status
pm2 status

# Monitor resources
pm2 monit
```

### Database Management

```bash
# Access PostgreSQL
sudo -u postgres psql tourworld_tourism

# Run Prisma migrations
cd /var/www/tourworld-tourism
npx prisma migrate deploy

# Open Prisma Studio (for database management)
npx prisma studio
# Access at http://your-server-ip:5555
```

### Update Application

```bash
cd /var/www/tourworld-tourism

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Regenerate Prisma client
npx prisma generate

# Run migrations (if any)
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart with PM2
pm2 restart tourworld-tourism
```

## 📊 Monitoring & Logs

### Application Logs
```bash
# PM2 logs
pm2 logs tourworld-tourism

# Real-time logs
pm2 logs tourworld-tourism --lines 100

# Error logs only
pm2 logs tourworld-tourism --err
```

### System Resources
```bash
# CPU and Memory usage
htop

# Disk usage
df -h

# Check PostgreSQL status
sudo systemctl status postgresql
```

## 🔐 Security Checklist

- [ ] Change default SSH port (optional but recommended)
- [ ] Setup SSH key authentication (disable password auth)
- [ ] Configure firewall (UFW)
- [ ] Install fail2ban for SSH protection
- [ ] Use strong database passwords
- [ ] Keep system updated: `sudo apt update && sudo apt upgrade`
- [ ] Setup automatic security updates
- [ ] Configure SSL/HTTPS
- [ ] Regular backups of database

## 💾 Backup Strategy

### Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/tourworld-tourism"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump tourworld_tourism > $BACKUP_DIR/db_backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

## 🐳 Alternative: Docker Deployment

If you prefer Docker, you can use the `docker-compose.yml` file:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install -y docker-compose

# Start services
cd /var/www/tourworld-tourism
docker-compose up -d

# View logs
docker-compose logs -f
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | NextAuth secret key | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your domain URL | `https://yourdomain.com` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` (optional) |

## 🆘 Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs tourworld-tourism --err

# Check if port is in use
sudo netstat -tulpn | grep 3000

# Verify environment variables
pm2 env tourworld-tourism
```

### Database connection issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U tourworld_user -d tourworld_tourism -h localhost
```

### Nginx issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## 📚 Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PostgreSQL Administration](https://www.postgresql.org/docs/current/admin.html)

## ✅ Ready to Deploy!

Once you have your VPS, follow these steps in order. The entire setup should take about 30-45 minutes.

**Next Steps:**
1. Purchase VPS (recommended: 2GB RAM, 1 CPU minimum)
2. Setup SSH access
3. Follow Step 1-10 above
4. Your application will be live!

