**Table of Contents**
1. [Node.js Project](#1-node.js-roject)  
2. [COPY Instruction](#2-copy-instruction)  
3. [Conatiner Port Mapping](#3-conatiner-port-mapping)  
4. [Unnecessary Rebuilds](#4-unnecessary-rebuilds)

## 1. Node.js Project

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


## 2. COPY Instruction

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



## 3. Conatiner Port Mapping

Even we successfully got our image built, and we are running a container out of it, we still are not be able to actually visit the port.

![Alt Text](/simpleWeb/assets/localhost.png)

- Our browser is making a request to local host 8080 which is a reference to our current machine on port 8080. By default, no traffic that is coming into our computer or into our local host network is routed into the container. The container essentially has its own isolated set of ports that can receive traffic, but by default no incoming traffic to our computer is going to be directed into a container. 

![Alt Text](/simpleWeb/assets/local.png)

In order to make sure that any request from either your computer or some outside computer will be redirected into the container we have to set up an explicit port mapping. A port mapping says, anytime that someone makes a request to a given port on your local network, take that request and automatically forward it to some port inside the container.

![Alt Text](/simpleWeb/assets/port_mapping.png)

One important point here is this is only about 'incoming requests'. Docker containers can by default make requests on its own behalf to the outside world, like installing a dependency. When we ran npm install during the Docker built process, npm reached to the outside world across the internet. So there is no limitation by default on containers ability to reach out. It's strictly limitation on the ability for incoming traffic to get into the containers.


## 4. Unnecessary Rebuilds

I created a new image from our Dockerfile.

![Alt Text](/simpleWeb/assets/rebuild.png)

Then I rebuild an additional image from the same Dockerfile. To create this additional image, BuildKit(or Docker builder) used Cache to create it. Because an image has the exactly the same content was created before.

![Alt Text](/simpleWeb/assets/rebuild2.png)

But when I make even a small change, I changed the index.html's response, every single step after COPY has to be executed again.

![Alt Text](/simpleWeb/assets/rebuild3.png)

But that's not ideal. If we don't make a change to a dependency inside of the project, we don't want to rerun `npm install`. Because all I did was change one of the source code files of our project. And that has nothing to do with our dependencies.

So how can we avoid having to reinstall all dependencies just because we made a little change tp one of the source code files?

So if i change the Dockerfile to this:

```
FROM node:20-alpine

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
```

Because the `npm install` reads package.json and installs all dependencies listed under dependencies, and we would skip the `npm install` step if we made any change in the source code.


The End.