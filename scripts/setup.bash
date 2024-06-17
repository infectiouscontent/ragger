#! /bin/bash
git config --global core.editor "vim"
git config --global user.name "infectiouscontent"
git config --global user.email infectiouscontent@icloud.com
git commit --amend --reset-author
sudo apt -y update
sudo apt -y upgrade
sudo apt -y install nodejs npm && echo "installed node version $(node -v)" && echo "installed npm version $(npm -v)"
npm install typescript
mkdir authentication
vi authentication/openai
while IFS='=' read -r key value; do export "$key"="$value"; done < "authentication/openai"
npm install
VITE_OPENAI_API_KEY=$OPENAI_API_KEY npm run dev
