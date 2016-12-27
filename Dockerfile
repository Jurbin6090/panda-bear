FROM node:6

#ENV NODE_ENV production

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Run babel build, then remove dev dependencies as they arn't needed anymore.
RUN npm run build && npm prune --production

EXPOSE 8080
CMD [ "node", "dist" ]


