FROM node:6

# Create app directory
RUN mkdir -p /usr/src/app && chown node:node /usr/src/app

USER node
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

ENV NODE_ENV production

# Bundle app source
COPY . /usr/src/app

# Run babel build, then remove dev dependencies as they arn't needed anymore.
RUN npm run build && npm prune --production

EXPOSE 8080
CMD [ "node", "dist" ]


