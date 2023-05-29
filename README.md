<h1 align="center">An open source alternative to Jira Kanban Board using SvelteKit, TailwindCSS, Upstash and Firebase Storage.</h1>

<img width="1512" alt="Screenshot 2023-05-29 at 8 02 11 PM" src="https://github.com/rishi-raj-jain/jira-sveltekit-firebase-storage-upstash-starter/assets/46300090/396e07f9-2ddf-459f-bd60-4036ce3c57b6">

<p align="center">
  An open source alternative to Jira Kanban Board made with SvelteKit, Upstash, Firebase Storage and TailwindCSS
</p>

<p align="center">
  <a href="https://twitter.com/rishi_raj_jain_">
    <img src="https://img.shields.io/twitter/follow/rishi_raj_jain_?label=Rishi Raj Jain" alt="Rishi Raj Jain Twitter follow" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>
<br/>

## Introduction

This is a starter template that aims to build the same experience of linear.app using SvelteKit, Upstash, Firebase Storage and TailwindCSS. 100% free, open-source and privacy friendly.

### SvelteKit Auth Setup Instructions

1. Make sure you've `AUTH_TRUST_HOST`=true in .env before you deploy anywhere
2. Create a random 32 char AUTH_SECRET and update it inside the .env file
3. Make sure you've added `GOOGLE_ID` and `GOOGLE_SECRET` in your `.env` after you [have setup Google Auth 2.0](https://support.google.com/cloud/answer/6158849?hl=en).

### Upstash Setup Instructions

![Upstash REST API Url & Token Screenshot](https://upstash.com/blog/powering-oss-alternative-to-linktree/screenzy-1682836109654.png)

Copy both the tokens, namely `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` and add them to your `.env` file.

### Firebase Storage Setup Instructions

1. [Create a default Cloud Storage bucket](https://firebase.google.com/docs/storage/web/start#create-default-bucket)

2. [Add your bucket URL to your app](https://firebase.google.com/docs/storage/web/start#add-bucket-url)


3. Copy the example firebase config json:

```bash
cp firebase-adminsdk.json.example firebase-adminsdk.json
```

3. Update the file `firebase-adminsdk.json` with the firebase config obtained from your firebase project. Read more about firebase config [here](https://firebase.google.com/docs/web/learn-more#config-object).

4. Update the json with the storageBucket value as obtained in Step 2.

## Screenshots

<img width="1512" alt="Screenshot 2023-05-29 at 8 02 11 PM" src="https://github.com/rishi-raj-jain/jira-sveltekit-firebase-storage-upstash-starter/assets/46300090/396e07f9-2ddf-459f-bd60-4036ce3c57b6">

<img width="1512" alt="Screenshot 2023-05-29 at 8 04 55 PM" src="https://github.com/rishi-raj-jain/jira-sveltekit-firebase-storage-upstash-starter/assets/46300090/028920d6-e253-4c90-b678-f68e7982686b">

## Author

- Rishi Raj Jain ([@rishi_raj_jain_](https://twitter.com/rishi_raj_jain_))
