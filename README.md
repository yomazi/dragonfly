# dragonfly

A simple launcher for the raven app, embedded in a Gmail add-on.

## Overview

**dragonfly** is a Gmail add-on that bridges my inbox with [**raven**](https://github.com/yomazi/raven), an app I built to automate tasks in Google workspaces.

It's written in [Google Apps Script](https://developers.google.com/apps-script), deployed with [clasp](https://developers.google.com/apps-script/guides/clasp), and published to the [Google Workspace Marketplace](https://developers.google.com/workspace/marketplace) as a public, unlisted app.

All dragonfly does is launch raven from inside Gmail. If you happen to be looking at a Gmail message at the time, dragonfly will deeplink into raven with the **threadId** and **messageId** of that message.

With that info, I can use raven to automate any task I want to do with my emails and their attachments:

- populate templates using data from a local database
- apply labels
- manage distribution lists in accordance with content
- categorize attachments
- rename attachments in accordance with some naming convention
- upload attachments to the correct show folder in Google Drive

... and dragonfly makes that possible.

That's it.

## Why is this file so long, then?

Because configuring and deploying Google Workspace add-ons is a whole thing. It took me an evening to get it right; I don't want that to happen again, so I documented everything. This file contains:

- An explanation of the architecture decisions behind dragonfly
- Local project setup
- How to use **clasp** (the Google Apps Script CLI)
- How to manage **OAuth scopes**
- How to set up the **Google Cloud Project** (this took hours)
- How to publish the addon in **Google Workspace Marketplace**, and why I published it the way I did
- How to install dragonfly on the account(s) that are meant to use it
- Debugging

You're welcome, future self.

## Architecture Decisions

### Why Google Apps Script (not Node.js)?

Gmail add-ons cannot be served from a self-hosted Node.js server. The two real options are:

- **Google Apps Script**: runs in Google's cloud, free, no infrastructure, native Gmail integration.
- **Google Cloud Run** / **Cloud Functions**: technically possible, but adds significant complexity (auth, HTTPS, JSON Cards format) with no benefit for a simple launcher.

### Deployment Model

Updates are deployed by **editing the existing deployment** (not creating a new one), so the Marketplace configuration never needs to change.

### App Visibility: Public + Unlisted

Dragonfly is published as a versioned deployment on the Google Workspace Marketplace as a **public**, **unlisted app**.

That's because:

- I am the only user
- I want to avoid sharing the script source across Google workspaces (this would be necessary if I relied merely on test deployments)

Personal or developer accounts cannot create **private** apps on Google Workspace Marketplace; this option requires a customer ID.

Since dragonfly is a **public** app, dragonfly can theoretically be installed by anyone without having to share the code - but since it is **unlisted**, it does not appear in a Google Workspace Marketplace search.

## Local Project Setup

### Repository Structure

The project lives in a GitHub repository with the following structure:

```
dragonfly/
  .clasp.json          # Links to Apps Script project (keep out of git if repo is public)
  .claspignore         # Prevents clasp from uploading non-script files
  .prettierrc          # Code formatting config
  appsscript.json      # Add-on manifest
  Code.gs              # All add-on logic
  ...                  # <any other code files>
  README.md			   # This file
  assets/
    dragonfly.png      # Add-on icon (served via raw.githubusercontent.com)
```

### .clasp.json

Created automatically by clasp or manually. Contains the Apps Script project ID. _Do not commit this to a public repository; it is a direct handle to your script project_.

```
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "./"
}
```

### .claspignore

Prevents clasp from uploading non-script files to Apps Script, which would cause errors:

```
.clasp.json
.prettierrc
.gitignore
README.md
assets/
```

### Icon Hosting

Apps Script can't serve static files, and the manifest's `logoUrl` must point to an externally hosted image over HTTPS.

The icon is part of this GitHub repository so that it can be hosted on GitHub. :-)

## clasp Workflow

### Initial Setup

Install clasp globally:

`npm install -g @google/clasp`

Log in:

`clasp login`

This opens a browser window to authorize clasp with your Google account. Credentials are stored in **~/.clasprc.json**.
Create or link a project. To link to an existing Apps Script project, create .clasp.json manually with the script ID from the Apps Script editor (Project Settings). To create a new project:

`clasp create --type standalone`

### Pushing Code

`clasp push`

Uploads all files not excluded by `.claspignore` to the Apps Script project. Say yes if prompted about overwriting remote files.

### Deploying Updates

To update an existing deployment without changing the deployment ID (which would require updating the Marketplace config):

- In the Apps Script editor, go to **Deploy** | **Manage deployments**
- Click the edit (pencil) icon on the existing deployment
- Change the version to **New version**
- Click **Deploy**

Why do it this way?

Because deploying with **Deploy** | **New deployment**, would create a new deployment ID. To use that deployment ID, I'd have to update the Marketplace SDK configuration.

## Managing OAuth Scopes

Scopes must be declared in **two** places, and kept in sync:

1. `appsscript.json` (the `oauthScopes` array):

```
  "oauthScopes": [
    "https://www.googleapis.com/auth/gmail.addons.execute",
    "https://www.googleapis.com/auth/script.locale",
    "https://www.googleapis.com/auth/gmail.addons.current.message.metadata"
  ]
```

<ol start="2">
  <li>Cloud Console — <b>APIs & Services</b> | <b>Google Workspace Marketplace SDK</b> | <b>App Configuration</b> | <b>OAuth Scopes</b>:</li>
</ol>

### Adding a scope

- Add it to oauthScopes in appsscript.json
- Add it in Cloud Console
- `clasp push`
- Uninstall and reinstall the add-on to trigger a fresh OAuth authorization flow (existing installations will not automatically pick up new scopes)

### Removing a scope

- Remove it from `appsscript.json`
- Remove it in Cloud Console
- `clasp push`
- Uninstall and reinstall

The two scopes Google adds automatically (`userinfo.email` and `userinfo.profile`) appear in Cloud Console but do not need to be in appsscript.json.

## Google Cloud Project Setup

Google Apps Script projects are associated with a default Google Clould Project. To link a script to a specific OAuth consent configuration, a new Google Cloud Project is needed. Without that, you can only use test deployments under the developer account.

### Step 1: Create the Cloud Project

- Go to console.cloud.google.com
- Click the project dropdown at the top | **New Project**
- Name it (e.g. dragonfly) | **Create**

Note the Project ID (e.g. {project name}-{6-digit code}) and the numeric Project Number

### Step 2: Link to Apps Script

- In the Apps Script editor, click the gear icon | **Project Settings**
- Scroll to Google Cloud Platform project | **Change project**
- Enter the Project Number (not the ID) → **Set project**

⚠ You must configure the OAuth consent screen before this step will succeed. If you get an error, complete Step 3 first and then come back.

### Step 3: Configure OAuth Consent Screen

- In Cloud Console, go to **APIs & Services** | **OAuth consent screen**
- Click **Get Started**
- App Information: enter app name and your support email
- Audience: select **External**
- Contact Information: enter your developer email
- Finish: agree to policies and create
- After creation, go to **Audience** in the left nav
- Under Test users, click **Add Users** and add the email of your target Workspace account

### Step 4: Enable the Marketplace SDK

- In Cloud Console, go to **APIs & Services** | Library
- Search for **Google Workspace Marketplace SDK** | **Enable**

### Step 5: Configure the Marketplace SDK

- Go to APIs & Services → Google Workspace Marketplace SDK → App Configuration
- App Visibility: select Public, then check Unlisted

⚠ **Private visibility requires a Google Workspace account with a customer ID**. A personal or standard developer account cannot use Private. Public + Unlisted is the correct combination for a personal unlisted app — it is not findable via search, only via direct URL.

- Installation Settings: **Individual + Admin Install**
- App Integrations: check Google Workspace Add-on, then check Apps Script add-on and enter the deployment ID
- OAuth Scopes: add the same scopes as in appsscript.json
- Developer Information: fill in name, website, email, trader status (non-trader)
- Save

### Step 6: Complete the Store Listing

- Go to **APIs & Services** | **Google Workspace Marketplace SDK** | **Store Listing**
- Fill in required fields: app description, category, icon assets (at minimum 128x128)
- Support Links: Terms of Service URL, Privacy Policy URL, Support URL (for this tiny app, the raven domain works for all three)
- Draft Testers: add your target Workspace account email here

⚠ **Do not click Submit for Review**. That triggers the full public Google review process, which is not needed for an unlisted personal app. Draft Testers can install directly without review.

## Installing on the Target Account

Once the Store Listing is saved with your target account as a Draft Tester, install the add-on by navigating to the following URL while logged into the target Workspace account:

`https://workspace.google.com/marketplace/app/{your app name}/YOUR_APP_ID`

_This URL is not listed anywhere in the console! You construct it from the App ID._

The App ID is the numeric ID shown at the top of the App Configuration page.

## Debugging

If the add-on throws an error in Gmail, check the execution logs:

- In the Apps Script editor, click **Executions** in the left nav
- Find the failed execution and open the context menu | **Cloud logs**
- The full error message and stack trace will be there

⚠ **For Google Workspace Add-ons, you must provide an explicit list of OAuth scopes in appsscript.json**.
