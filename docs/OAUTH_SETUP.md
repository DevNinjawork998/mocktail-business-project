# OAuth Setup Guide

This guide will help you set up Google and Apple OAuth authentication for the admin dashboard.

## Overview

The application supports three authentication methods:

1. **Credentials** - Email/password login (always available)
2. **Google OAuth** - Sign in with Google account
3. **Apple OAuth** - Sign in with Apple ID

OAuth providers are optional. If not configured, only credentials login will be available.

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret**

### 2. Add to Environment Variables

Add to `.env.development.local`:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Add to production environment variables (Vercel/your hosting):

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Apple OAuth Setup

### 1. Create Apple Service ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Create a new **Services ID**:
   - Click "+" next to "Identifiers"
   - Select "Services IDs" and continue
   - Enter a description and identifier (e.g., `com.yourcompany.app`)
   - Enable "Sign in with Apple"
   - Configure domains and redirect URLs:
     - Development: `http://localhost:3000/api/auth/callback/apple`
     - Production: `https://yourdomain.com/api/auth/callback/apple`
4. Create a **Key** for Sign in with Apple:
   - Go to "Keys" section
   - Click "+" to create a new key
   - Enable "Sign in with Apple"
   - Download the key file (`.p8` file) - you can only download it once!
   - Note the Key ID

### 2. Generate Apple Secret

You need to generate a JWT secret from the Apple key. Use this script or an online tool:

```bash
# Install jwt-cli if needed
npm install -g jwt-cli

# Generate secret (replace with your values)
jwt encode \
  --alg ES256 \
  --kid YOUR_KEY_ID \
  --iss YOUR_TEAM_ID \
  --key path/to/AuthKey_KEYID.p8
```

Or use an online tool like [jwt.io](https://jwt.io/) with:

- Algorithm: ES256
- Header: `{"alg":"ES256","kid":"YOUR_KEY_ID"}`
- Payload: `{"iss":"YOUR_TEAM_ID","iat":TIMESTAMP,"exp":TIMESTAMP+15768000,"aud":"https://appleid.apple.com"}`
- Private Key: Contents of your `.p8` file

### 3. Add to Environment Variables

Add to `.env.development.local`:

```env
APPLE_ID=your-service-id (e.g., com.yourcompany.app)
APPLE_SECRET=your-generated-jwt-secret
```

Add to production environment variables:

```env
APPLE_ID=your-service-id
APPLE_SECRET=your-generated-jwt-secret
```

## User Roles

When users sign in via OAuth:

- **New users** are automatically created with `EDITOR` role
- **Existing users** keep their current role
- To upgrade a user to `ADMIN`, update the database directly or use the seed script

### Upgrade User to Admin

```typescript
// Using Prisma Studio
npx prisma studio

// Or via script
const user = await prisma.user.update({
  where: { email: "user@example.com" },
  data: { role: "ADMIN" },
});
```

## Testing OAuth

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. You should see OAuth buttons if providers are configured

4. Click "Continue with Google" or "Continue with Apple"

5. Complete the OAuth flow

6. You'll be redirected to the dashboard

## Troubleshooting

### OAuth buttons not showing

- Check that environment variables are set correctly
- Restart the development server after adding env vars
- Verify the provider credentials are valid

### "Invalid redirect URI" error

- Ensure redirect URIs in OAuth provider settings match exactly:
  - Development: `http://localhost:3000/api/auth/callback/{provider}`
  - Production: `https://yourdomain.com/api/auth/callback/{provider}`

### Apple Sign In not working

- Verify the JWT secret is correctly generated
- Check that the Service ID is enabled for "Sign in with Apple"
- Ensure the key hasn't expired (they last 6 months)

### User created but can't access admin routes

- OAuth users default to `EDITOR` role
- Upgrade the user to `ADMIN` role in the database
- Or modify the signIn callback in `auth.config.ts` to assign ADMIN role based on email domain

## Security Notes

- Never commit OAuth secrets to version control
- Use different credentials for development and production
- Rotate secrets regularly
- Use environment variables for all sensitive data
- Apple secrets expire after 6 months - set a reminder to regenerate

## Account Linking

The system supports account linking:

- If a user signs in with OAuth using an email that already has a credentials account, the accounts will be linked
- Users can sign in with either method after linking
- This is enabled via `allowDangerousEmailAccountLinking: true` in the provider config
