![Starstrike App Banner](/README/banner.png "Starstrike App Banner")

# ⭐ Starstrike App ⚡

![Production GitHub Workflow Status](https://github.com/joshkautz/Starstrike-App/actions/workflows/firebase-hosting-merge.yml/badge.svg "Production GitHub Workflow Status")

## Development 💻

To begin development on the static site, open `./Site/index.html` in your browser and IDE and begin development.

To begin development on the serverless functions, open `./Functions/index.js` in your IDE and begin development. You will want to use `firebase emulators:start` to leverage Firebase Local Emulator Suite for debugging. Be sure that you have sure to have Node.js v16.x.x installed.

## Deployment 📦

### Automatic: Deploy Site to Firebase Hosting Preview Channel

1. Create a Pull Request to merge a new feature branch into the Main branch.
2. Firebase Hosting GitHub Action will build and deploy the new changes to a Preview Channel on Firebase Hosting.

### Automatic: Deploy Site to Firebase Hosting Live Channel

3. After testing the features at the Preview Channel URL, merge the Pull Request into the Main branch.
4. Firebase Hosting GitHub Action will build and deploy the new changes to the Live Channel on Firebase Hosting.

### Manual: Deploy Site to Firebase Hosting Preview Channel

Windows

```PowerShell
$Date = Get-Date -Format "dddd-MM-dd-yyyy-HH-mm-ss"
$Channel = "Preview-" + $Date
firebase hosting:channel:deploy $Channel --expires 7d --project starstruck-github-app-bee1b
```

Linux

```Bash
Date=$(date +'%A-%m-%d-%Y-%H-%M-%S')
Channel="Preview-"$Date
firebase hosting:channel:deploy $Channel --expires 7d --project starstruck-github-app-bee1b
```

### Manual: Deploy Site to Firebase Hosting Live Channel

Windows / Linx

```
firebase deploy --only hosting --project starstruck-github-app-bee1b
```

### Automatic: Deploy App to Firebase Functions

_Not yet implemented._

1. Create a Pull Request to merge a new feature branch into the Main branch.
2. Merge the Pull Request into the Main branch.
3. GitHub Actions will build and deploy the new changes to Firebase Functions.

### Manual: Deploy App to Firebase Functions

Windows / Linx

```
firebase deploy --only functions --project starstruck-github-app-bee1b
```

<hr>

_This static site was created using the "One Page Portfolio Website Template" from [Designmodo](https://github.com/designmodo/html-website-templates)._
