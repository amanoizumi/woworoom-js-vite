set -e

npm run build

cd dist

git init
git add -A
git commit -m 'deploy'

git push https://github.com/amanoizumi/woworoom-js-vite.git master:gh-pages

cd -