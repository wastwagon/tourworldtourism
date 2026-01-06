# Domain Configuration for tourworldtourism.com

## ✅ Coolify Access Status

I've successfully accessed your Coolify instance and located your application:
- **Coolify URL**: `http://31.97.57.75:8000`
- **Application**: `wastwagon/tourworldtourism:main-l8okcwwccgo0gokwk0wc4ock`
- **Current Domain**: `http://acwo08o8o0s4w4s8w4s0wko4.31.97.57.75.sslip.io`

## 🌐 DNS Configuration Required

To point `tourworldtourism.com` to your application, you need to configure DNS records:

### IP Address for DNS
**Your VPS IP Address**: `31.97.57.75`

### DNS Records to Add

In your domain registrar's DNS settings (where you registered `tourworldtourism.com`), add these A records:

1. **Main Domain (non-www)**:
   - **Type**: A
   - **Name**: `@` or `tourworldtourism.com`
   - **Value**: `31.97.57.75`
   - **TTL**: 3600 (or default)

2. **WWW Subdomain**:
   - **Type**: A
   - **Name**: `www`
   - **Value**: `31.97.57.75`
   - **TTL**: 3600 (or default)

### Example DNS Configuration

```
Type    Name    Value         TTL
A       @       31.97.57.75  3600
A       www     31.97.57.75  3600
```

## ⚙️ Coolify Domain Configuration

After DNS records are set up (can take 5 minutes to 48 hours to propagate):

1. **Log into Coolify**: `http://31.97.57.75:8000`
2. **Navigate to**: Projects → "My first project" → "production" → Your Application
3. **Click**: "Configuration" tab
4. **Find**: "Domain" field
5. **Enter**: `http://tourworldtourism.com` (or `https://tourworldtourism.com` if you want HTTPS)
6. **Click**: "Save" button
7. **Wait**: Coolify will automatically configure SSL/HTTPS via Let's Encrypt

## 🔒 SSL/HTTPS Setup

Coolify will automatically:
- Detect your domain once DNS propagates
- Request SSL certificate from Let's Encrypt
- Configure HTTPS automatically
- Renew certificates automatically

**Note**: SSL setup requires DNS to be fully propagated first.

## 📋 Verification Steps

1. **Check DNS Propagation**:
   ```bash
   # Check if DNS is pointing to your IP
   dig tourworldtourism.com +short
   # Should return: 31.97.57.75
   
   dig www.tourworldtourism.com +short
   # Should return: 31.97.57.75
   ```

2. **Test Domain in Coolify**:
   - After DNS propagates, add domain in Coolify Configuration
   - Coolify will verify domain ownership
   - SSL certificate will be issued automatically

3. **Access Your Site**:
   - `http://tourworldtourism.com` (HTTP)
   - `https://tourworldtourism.com` (HTTPS - after SSL setup)

## 🚨 Important Notes

- **DNS Propagation**: Can take 5 minutes to 48 hours. Most changes happen within 1-2 hours.
- **Port 80/443**: Ensure your VPS firewall allows traffic on ports 80 (HTTP) and 443 (HTTPS)
- **Coolify Traefik**: Coolify uses Traefik as a reverse proxy, which handles SSL automatically
- **Domain Format**: Use `http://tourworldtourism.com` (without trailing slash) in Coolify

## 🔧 Troubleshooting

### ⚠️ DNS Conflict Error: "CNAME and other data"

**Error Message**: `"Error: The DNS zone file is invalid. (Line 39: www.tourworldtourism.com: CNAME and other data)"`

**Problem**: You cannot have both a CNAME record and an A record for the same domain name. There's likely an existing CNAME record for `www.tourworldtourism.com` that conflicts with the A record you're trying to add.

**Solution**:

1. **Remove the existing CNAME record**:
   - In your Zone Editor, switch the filter to "CNAME" (or "All")
   - Find the CNAME record for `www.tourworldtourism.com`
   - Delete or remove that CNAME record
   - Save the changes

2. **Then add the A record**:
   - Switch filter back to "A"
   - Click "+ Add Record"
   - **Name**: `www` (or `www.tourworldtourism.com.` - note the trailing dot)
   - **Type**: `A`
   - **Record/Value**: `31.97.57.75`
   - **TTL**: `3600`
   - Click "Save Record"

3. **Also ensure root domain has A record**:
   - Add another A record:
   - **Name**: `@` (or `tourworldtourism.com.` - note the trailing dot)
   - **Type**: `A`
   - **Record/Value**: `31.97.57.75`
   - **TTL**: `3600`
   - Click "Save Record"

4. **Save all changes**:
   - Click "Save All Records" button at the top

**Important**: You must remove the CNAME record BEFORE adding the A record. DNS doesn't allow both record types for the same name.

### Domain Not Working?
1. Verify DNS records are correct: `dig tourworldtourism.com`
2. Check firewall allows ports 80/443
3. Ensure domain is saved in Coolify Configuration
4. Check Coolify logs for SSL certificate errors
5. Verify no conflicting CNAME records exist

### SSL Not Working?
1. Wait for DNS to fully propagate (can take up to 48 hours)
2. Check Coolify logs for Let's Encrypt errors
3. Verify domain is accessible via HTTP first
4. Check firewall allows port 443

## 📞 Next Steps

1. ✅ **Configure DNS** at your domain registrar (add A records pointing to `31.97.57.75`)
2. ⏳ **Wait for DNS propagation** (check with `dig` command)
3. 🔧 **Add domain in Coolify** Configuration tab
4. 🔒 **Wait for SSL** certificate to be issued automatically
5. 🎉 **Access your site** at `https://tourworldtourism.com`

---

**Your VPS IP**: `31.97.57.75`  
**Domain**: `tourworldtourism.com`  
**Coolify**: `http://31.97.57.75:8000`

