# PostgreSQL and pgAdmin Setup Guide

This guide will walk you through installing PostgreSQL and pgAdmin, then connecting them to the Belinda's Closet project. Follow each step carefully.

## What You'll Install

- **PostgreSQL**: The database server that stores all application data
- **pgAdmin**: A web-based tool to manage PostgreSQL databases visually

## Step 1: Install PostgreSQL

### For Windows

1. **Download PostgreSQL**

   - Go to: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Click "Download the installer"
   - Download the latest version (15.x or higher)

2. **Run the Installer**

   - Double-click the downloaded `.exe` file
   - Click "Next" through the welcome screens
   - **Installation Directory**: Keep default (`C:\Program Files\PostgreSQL\15`)
   - **Components**: Keep all selected (PostgreSQL Server, pgAdmin, Stack Builder, Command Line Tools)
   - **Data Directory**: Keep default
   - **Password**: Enter a password for the `postgres` user
     - **IMPORTANT**: Remember this password! You'll need it later
     - Example: `mypassword123` (use something secure)
   - **Port**: Keep default `5432`
   - **Locale**: Keep default
   - Click "Next" and then "Install"

3. **Complete Installation**
   - Wait for installation to finish
   - **Uncheck** "Launch Stack Builder" at the end
   - Click "Finish"

### For macOS

1. **Option 1: Official Installer**

   - Go to: [https://www.postgresql.org/download/macos/](https://www.postgresql.org/download/macos/)
   - Download and run the installer
   - Follow similar steps as Windows

2. **Option 2: Homebrew (Recommended for developers)**

   ```bash
   # Install Homebrew if you don't have it
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   # Install PostgreSQL
   brew install postgresql@15

   # Start PostgreSQL service
   brew services start postgresql@15
   ```

### For Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql
\password postgres
# Enter your password when prompted
\quit
```

## Step 2: Install pgAdmin

### For Windows

- pgAdmin was already installed with PostgreSQL in Step 1
- Look for "pgAdmin 4" in your Start menu

### For macOS

```bash
# Using Homebrew
brew install --cask pgadmin4
```

### For Linux

```bash
# Add pgAdmin repository
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg

sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'

# Install pgAdmin
sudo apt update
sudo apt install pgadmin4
```

## Step 3: First-Time pgAdmin Setup

1. **Launch pgAdmin**

   - **Windows**: Start menu → pgAdmin 4
   - **macOS**: Applications → pgAdmin 4
   - **Linux**: Applications menu → pgAdmin 4

2. **Set Master Password**
   - pgAdmin will open in your web browser
   - Set a master password for pgAdmin (this is different from your PostgreSQL password)
   - Click "OK"

## Step 4: Connect pgAdmin to PostgreSQL

1. **Check for Existing Server**

   - Look in the left sidebar for "Servers"
   - If you see "PostgreSQL 15" (or similar), click on it
   - Enter your PostgreSQL password when prompted
   - **Skip to Step 5** if this works

2. **If No Server Exists, Add One**
   - Right-click on "Servers" → "Register" → "Server"
3. **General Tab**
   - **Name**: `Belinda's Closet Local`
4. **Connection Tab**
   - **Host name/address**: `localhost`
   - **Port**: `5432`
   - **Maintenance database**: `postgres`
   - **Username**: `postgres`
   - **Password**: [Your PostgreSQL password from Step 1]
   - **Save password**: Check this box
5. **Click "Save"**

## Step 5: Create Project Database

1. **Expand Your Server**

   - In the left sidebar, click on your server to expand it
   - You should see "Databases" appear

2. **Create New Database**

   - Right-click on "Databases" → "Create" → "Database..."
   - **Database name**: `belindas_closet`
   - **Owner**: `postgres`
   - Click "Save"

3. **Verify Database Creation**
   - You should now see `belindas_closet` under Databases
   - The database is ready for the project!

## Step 6: Test Your Setup

1. **Check PostgreSQL is Running**

   - **Windows**: Open Services → Look for "postgresql-x64-15" (should be "Running")
   - **macOS**: `brew services list | grep postgresql`
   - **Linux**: `sudo systemctl status postgresql`

2. **Test Connection from Command Line** (Optional)
   ```bash
   # This should work if everything is set up correctly
   psql -h localhost -p 5432 -U postgres -d belindas_closet
   # Enter your password when prompted
   # Type \q to quit
   ```

## Step 7: Configure the Project

1. **Navigate to Backend Directory**

   ```bash
   cd belindas-closet-nestjs
   ```

2. **Copy Environment File**

   ```bash
   cp .env.example .env
   ```

3. **Edit the .env File**
   Open `.env` and update these values:

   ```env
   # Replace 'your_password' with your actual PostgreSQL password
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/belindas_closet
   PORT=3000
   ```

4. **If Your Password Has Special Characters**
   URL-encode them in the DATABASE_URL:

   - `@` becomes `%40`
   - `#` becomes `%23`
   - `%` becomes `%25`
   - `&` becomes `%26`

   Example: Password `Pass@123#` becomes:

   ```env
   DATABASE_URL=postgresql://postgres:Pass%40123%23@localhost:5432/belindas_closet
   ```

## Step 8: Start the Project

1. **Install Dependencies** (from project root)

   ```bash
   npm install
   ```

2. **Start Backend** (creates database tables automatically)

   ```bash
   cd belindas-closet-nestjs
   npm run start:dev
   ```

   You should see:

   ```
   [Nest] Application successfully started end of the line
   ```

3. **Start Frontend** (in a new terminal)

   ```bash
   cd belindas-closet-nextjs
   npm run dev
   ```

4. **Verify Everything Works**
   - Backend: [http://localhost:3000/api](http://localhost:3000/api)
   - Frontend: [http://localhost:8082](http://localhost:8082) -- this port depends on availability of ports

````

### Port 5432 Already in Use
1. **Find what's using the port**:
   ```bash
   # Windows
   netstat -ano | findstr :5432

   # macOS/Linux
   lsof -i :5432
````

Solution: Either stop the other service or change PostgreSQL port in configuration

### Permission Denied Errors

- **Windows**: Run Command Prompt as Administrator
- **macOS/Linux**: Use `sudo` for system commands
- Make sure you're in the correct directory when running npm commands

## What's Next?

## Quick Reference

### Important Passwords

- **PostgreSQL User**: `postgres`
- **PostgreSQL Password**: [The one you set during installation]
- **Database Name**: `belindas_closet`

### Important URLs

- **Backend API**: http://localhost:3000/api
- **Frontend**: http://localhost:8082

### Useful Commands

# Connect to database via command line

psql -h localhost -p 5432 -U postgres -d belindas_closet

```

## Getting Help

If you encounter issues or want to learn more

4. **PostgreSQL Documentation**: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
5. **pgAdmin Documentation**: [https://www.pgadmin.org/docs/](https://www.pgadmin.org/docs/)

---
```
# Testing ci-cd-socket security