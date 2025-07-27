**Table of Contents**
1. [Dockerfile](#1-dockerfile)  
2. [What's a Base Image? An Analogy](#2-whats-a-base-image-an-analogy)  
3. [The Build Process in Detail](#3-the-build-process-in-detail)  
4. [Rebuilds with Cache](#4-rebuilds-with-cache) 
5. [Executing Commands in Running Container](#5-executing-commands-in-running-container) 
6. [Tagging an Image](#6-tagging-an-image) 
7. [Manual Image Generation with Docker Commit](#7-manual-image-generation-with-docker-commit) 

## 1. Dockerfile
![Alt Text](/redis-image/1.png)

The instruction FROM is used to specfy the Docker image that we want to use as a base. So by saying alpine, we want to use base image of alpine when preparing our image.

The RUN instruction is used to execute some command while we are preparing our custom image.

The CMD instruction specifies what should be executed when our image is used to start up a brand new container.

By running the command 'docker build .' in wherever the Dockerfile is located, we create an iamge of it. Then we can create a container of that image by running the command 'docker run <PID>'


## 2. What's a Base Image? An Analogy..

Say we have a computer with no operating system in it. And we want to install Chrome on computer. These would be the steps:

![Alt Text](/redis-image/2.1.png)

These steps are very similar to what we do inside the Dockerfile. When we create an image, we have an empty image, like the computer with no operating system. When we specify the base image of Alpine, that was like installing an operating system. 

But why did we use Alpine? It's like why do we use Ubuntu, Windows, or MacOS. The answer is because they have some built in applications. Suchlike we made use Alpine base image because it has a set of program inside of it that useful for installing and running Redis.

![Alt Text](/redis-image/2.2.png)


## 3. The Build Process in Detail

![Alt Text](/redis-image/3.1.png)

Briefly, every single step in Dockerfile works like creating a new image for the next instruction, and the next instruction use that image's fiel system snapshot to create a new  temporary container(this temporary containers status and IDs appear on terminal). Finally the last instruction takes that modified image as file system snaphot.

Every steps look for an image comes from the previous step. So it is kind of like nested images are trying to arrive the last instruction.

![Alt Text](/redis-image/3.2.png)


## 4. Rebuilds with Cache
 
Docker cache is a mechanism that reuses previously built layers (intermediate images) to speed up subsequent builds. When you rebuild a Docker image, Docker checks if the instructions in your Dockerfile have changed. If not, it reuses cached layers instead of rebuilding them from scratch. Inside the Docker VM (managed by Docker Desktop).

![Alt Text](/redis-image/4.png)

When first time we ran 'docker build .' command for our Dockerfile, Docker fetches the alpine base image from Docker Hub, then Docker checked Cache first for redis that then is downloaded from Alpine's package manager (apk) because it didn't exist in Cache(see the picture's first part).

When I ran the 'docker build .' command for the second time, Docker checked Cache first for redis, and found it. In this way Cache reduced the building time(see the yellow boxes).


## 5. Executing Commands in Running Container

![Alt Text](/redis-image/5.png)

By using the 'exec' command, we are able to start up a second running program inside of our container.

When the container still running, we can run another program as well; 
example command: `docker exec -it <PID> redis-cli`


## 6. Tagging an Image

![Alt Text](/redis-image/6.png)

Command for tagging: `docker build -t myRedis:lastone .`

In the example command, 'myRedis' is name column of Docker Hub Images, and 'lastone' is tag column.

Tags are just human-readable references. Containers run the same way regardless of the tag.


## 7. Manual Image Generation with Docker Commit

'commit' is not very commanly used but it help you get better handle on the relationship between an image and a container.

We can manually create a container from an existing image, modify it (e.g., run commands or change its filesystem), and then commit those changes to generate a new reusable image. This new image can be used later to spawn containers with the applied changes.
Similarly, we can modify an already running container, commit its state, and create a new image from it.

So now we are going to create a container manually that do whatever our Dockerfile does.

![Alt Text](/redis-image/7.1.png)

- 1. manually created a container out of Alpine image [1 red]
- 2. added a dependency,Redis, to the container [2 red]

So we now have a running container where we have modified its file system. And the file system has now seen the installation of Redis on terminal [3 yellow box]

![Alt Text](/redis-image/7.2.png)

While the container is running, I opened up a new terminal. And ran a command using Docker CLI that took a snapshot of that running container and assigned a default command to it, and generate an image out of the entire thing.

- 3. ran `docker ps` to get the ID of that running container [4 red]
- 4. set up the default command, `docker commit -c 'CMD ["redis-server"]' <ID of running container>`. '-c' allows us to specify the default command [5 red]
- 5. The output is the ID of the new image that we just customised for our own uses [6 green]
- 6. `docker run <output: ID of the new image>` command starts up a new container out of the image that we just created
- 7. Inside that running container we already have Redis installed. And default starting command ran Redis Server [7 yellow]