Goal of the project is to create a Node.js application, wrap it inside of a Docker container, and then be able to access that web application from a browser running on our local machine. Don't worry about deploying this app right now, we just focus on getting Node.js to work inside of a Docker container.

![Alt Text](/simpleWeb/assets/steps.png)

Important Note: Buildkit will hide away much of its progress which is the legacy builder did not do. To see this output, we will want to pass the progress flag to the build command: `docker build --progress=plain .`

To disable Buildkit, you can just pass the following variable to the build command: `DOCKER_BUILDKIT=0 docker build .`

So I created the Dockerfile. Then ran `docker build .` command inside the simpleWeb directory.

But got this error:
![Alt Text](/simpleWeb/assets/npm_error.png)

But we tried to install npm inside of a temporary container, there was no copy of npm available. Because we used alpine as our base image. Remeber we choose base image based upon the collection of default programs that we need successfully build our image. So alpine does not have npm.

To solve this issue we can use a different base image that already has node and npm pre-installed inside of it, or we can continue using alpine image and run an additional command to attempt to install Node.js and npm inside of our image.

In our case, we are going to find someone else's image that has already been configured to have npm pre-installed inside of it.

We go to hub.docker.com/explore, find 'node' repository. 'node' repository on Docker Hub is an image that has node pre-installed on it. 

And we find node image with apline tag.

![Alt Text](/simpleWeb/assets/alpine.png)

Because alpine in hub is tag, not the repository, we write FROM instruction with first the repository name, column, and the tag like `FROM node:alpine`.

Why we stick with alpine, but not only node repository for FROM instruction. In Docker world, Alpine is a term for an image that is as small and compact as possible. Alpine version of node image means we are not going to get a bunch of additional pre-installed programs.


## COPY Instruction

COPY Instruction is used to move files and folders from our local file system on our machine to the file system inside of that temporary container.

![Alt Text](/simpleWeb/assets/copy_instruction.png)

When I ran `docker build .` command i got this error:

![Alt Text](/simpleWeb/assets/copy_error.png)

So I added `COPY ./ ./` instruction into Dockerfile, generated the new image, and ran the image successfully.

```
FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm cache clean --force && npm install

CMD ["npm", "start"]
```
