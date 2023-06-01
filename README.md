<h1 align="center">An open source alternative to Jira Kanban Board using SvelteKit, TailwindCSS, Upstash and Firebase Storage.</h1>

<img width="1512" alt="Screenshot 2023-05-29 at 8 10 10 PM" src="https://github.com/rishi-raj-jain/jira-sveltekit-firebase-storage-upstash-starter/assets/46300090/cd212ac7-5478-4383-897c-2e8d5c0956ca">

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
  <a href="#screenshots"><strong>Screenshots</strong></a> ·
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

<img width="1512" alt="Screenshot 2023-05-29 at 8 10 10 PM" src="https://github.com/rishi-raj-jain/jira-sveltekit-firebase-storage-upstash-starter/assets/46300090/cd212ac7-5478-4383-897c-2e8d5c0956ca">

<img width="1002" alt="Screenshot 2023-05-29 at 8 11 52 PM" src="https://github.com/rishi-raj-jain/jira-sveltekit-firebase-storage-upstash-starter/assets/46300090/df1c59a8-b3e7-4a43-b8ab-34629699c6db">

## Author

- Rishi Raj Jain ([@rishi_raj_jain_](https://twitter.com/rishi_raj_jain_))
