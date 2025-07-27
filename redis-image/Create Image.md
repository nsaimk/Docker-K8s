**Table of Contents**
1. [Dockerfile](#1-dockerfile)  
2. [What's a Base Image? An Analogy](#2-whats-a-base-image-an-analogy)  
3. [The Build Process in Detail](#3-the-build-process-in-detail)  
4. [Rebuilds with Cache](#4-rebuilds-with-cache) 

## 1. Dockerfile
![Alt Text](/redis-image/1.png)

The instruction FROM is used to specfy the Docker image that we want to use as a base. So by saying alpine, we want to use base image of alpine when preparing our image.

The RUN instruction is used to execute some command while we are preparing our custom image.

The CMD instruction specifies what should be executed when our image is used to start up a brand new container.


## 2. What's a Base Image? An Analogy..

Say we have a computer with no operating system in it. And we want to install Chrome on computer. These would be the steps:

![Alt Text](/redis-image/2.png)

These steps are very similar to what we do inside the Dockerfile. When we create an image, we have an empty image, like the computer with no operating system. When we specify the base image of Alpine, that was like installing an operating system. 

But why did we use Alpine? It's like why do we use Ubuntu, Windows, or MacOS. The answer is because they have some built in applications. Suchlike we made use Alpine base image because it has a set of program inside of it that useful for installing and running Redis.

![Alt Text](/redis-image/3.png)


## 3. The Build Process in Detail

![Alt Text](/redis-image/4.png)

Briefly, every single step in Dockerfile works like creating a new image for the next instruction, and the next instruction use that image's fiel system snapshot to create a new  temporary container(this temporary containers status and IDs appear on terminal). Finally the last instruction takes that modified image as file system snaphot.

Every steps look for an image comes from the previous step. So it is kind of like nested images are trying to arrive the last instruction.

![Alt Text](/redis-image/5.png)

## 4. Rebuilds with Cache
 
Docker cache is a mechanism that reuses previously built layers (intermediate images) to speed up subsequent builds. When you rebuild a Docker image, Docker checks if the instructions in your Dockerfile have changed. If not, it reuses cached layers instead of rebuilding them from scratch. Inside the Docker VM (managed by Docker Desktop).

![Alt Text](/redis-image/6.png)

When first time we ran 'docker build .' command for our Dockerfile, Docker fetches the alpine base image from Docker Hub, then Docker checked Cache first for redis that then is downloaded from Alpine's package manager (apk) because it didn't exist in Cache(see the picture's first part).

When I ran the 'docker build .' command for the second time, Docker checked Cache first for redis, and found it. In this way Cache reduced the building time(see the yellow boxes).