FROM node:alpine

LABEL "com.github.actions.name"="botamic-first-timer"
LABEL "com.github.actions.description"="A GitHub App built with Probot that welcomes first-time contributors."
LABEL "com.github.actions.icon"="code"
LABEL "com.github.actions.color"="gray-dark"

LABEL "repository"="https://github.com/botamic/first-timer"
LABEL "homepage"="https://github.com/botamic/first-timer"
LABEL "maintainer"="Brian Faust <hello@basecode.sh>"

ENV PATH=$PATH:/app/node_modules/.bin

WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --production
COPY . .

ENTRYPOINT ["probot"]
CMD ["run", "/app/index.js"]
