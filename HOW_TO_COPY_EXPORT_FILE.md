# 📋 How to Copy Export File Contents (Step 5)

## Method 1: Using Terminal/Command Line (Mac/Linux)

### Option A: Copy to Clipboard Directly

```bash
# Copy entire file to clipboard
cat local-db-export-final.json | pbcopy
```

Then paste in Coolify Terminal (Cmd+V or right-click → Paste)

### Option B: Display and Select

```bash
# Display file (then select all and copy)
cat local-db-export-final.json
```

Then:
1. Select all text (Cmd+A)
2. Copy (Cmd+C)
3. Paste in Coolify Terminal

---

## Method 2: Using a Text Editor

### Using VS Code or Any Text Editor:

1. **Open the file**:
   ```bash
   code local-db-export-final.json
   ```
   Or open it in any text editor

2. **Select All**: `Cmd+A` (Mac) or `Ctrl+A` (Windows/Linux)

3. **Copy**: `Cmd+C` (Mac) or `Ctrl+C` (Windows/Linux)

4. **Paste in Coolify Terminal**: `Cmd+V` or right-click → Paste

---

## Method 3: Using Terminal with Less (Easier for Large Files)

```bash
# View file with less (easier to navigate)
less local-db-export-final.json
```

Then:
- Press `G` to go to end of file
- Press `1G` to go to beginning
- Select all text and copy

---

## Method 4: Direct File Transfer (If Available)

If Coolify has a file upload feature:
1. Go to Coolify → Your Application → File Manager (if available)
2. Upload `local-db-export-final.json` directly

---

## ⚡ Quickest Method (Recommended)

**On Mac:**

```bash
# Copy entire file to clipboard
cat local-db-export-final.json | pbcopy

# Then in Coolify Terminal:
# 1. Run: nano local-db-export-final.json
# 2. Paste: Cmd+V (or right-click → Paste)
# 3. Save: Ctrl+X, then Y, then Enter
```

**On Windows:**

```bash
# Copy entire file to clipboard
type local-db-export-final.json | clip

# Then in Coolify Terminal:
# 1. Run: nano local-db-export-final.json
# 2. Paste: Ctrl+V (or right-click → Paste)
# 3. Save: Ctrl+X, then Y, then Enter
```

---

## 📝 Step-by-Step in Coolify Terminal

1. **In Coolify Terminal**, run:
   ```bash
   nano local-db-export-final.json
   ```

2. **On your local machine**, copy the file:
   ```bash
   cat local-db-export-final.json | pbcopy  # Mac
   # OR
   type local-db-export-final.json | clip   # Windows
   ```

3. **Go back to Coolify Terminal** (where nano is open)

4. **Paste**: 
   - Mac: `Cmd+V` or right-click → Paste
   - Windows: `Ctrl+V` or right-click → Paste

5. **Save and exit**:
   - Press `Ctrl+X`
   - Press `Y` (to confirm)
   - Press `Enter`

6. **Verify file was created**:
   ```bash
   ls -lh local-db-export-final.json
   ```
   Should show: `223K` file size

7. **Run import**:
   ```bash
   cat local-db-export-final.json | node scripts/import-to-production.js
   ```

---

## 🆘 Troubleshooting

### "File too large to paste"
- Try pasting in smaller chunks
- Or use file upload if available

### "Nano editor issues"
- Make sure you're in insert mode (just start typing/pasting)
- Use `Ctrl+X` to exit, `Y` to save, `Enter` to confirm

### "File not saving"
- Make sure you press `Y` after `Ctrl+X` to confirm save
- Check file exists: `ls -lh local-db-export-final.json`

---

**Ready?** Use the quickest method above to copy and paste the file!

