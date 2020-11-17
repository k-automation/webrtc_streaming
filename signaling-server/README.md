# Signaling Server

```bash
git init

heroku login -i
heroku create YOUR_APP_ID --buildpack heroku/nodejs
heroku git:remote -a YOUR_APP_ID

git add .
git commit -m "deploy"
git push heroku master
```