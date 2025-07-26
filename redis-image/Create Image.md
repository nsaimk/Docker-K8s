![Alt Text](/redis-image/1.png)

The instruction FROM is used to specfy the Docker image that we want to use as a base. So by saying alpine, we want to use base image of alpine when preparing our image.

The RUN instruction is used to execute some command while we are preparing our custom image.

The CMD instruction specifies what should be executed when our image is used to start up a brand new container.


## What's a Base Image? An Analogy..

Say we have a computer with no operating system in it. And we want to install Chrome on computer. These would be the steps:

![Alt Text](/redis-image/2.png)

These steps are very similar to what we do inside the Dockerfile. When we create an image, we have an empty image, like the computer with no operating system. When we specify the base image of Alpine, that was like installing an operating system. 

But why did we use Alpine? It's like why do we use Ubuntu, Windows, or MacOS. The answer is because they have some built in applications. Suchlike we made use Alpine base image because it has a set of program inside of it that useful for installing and running Redis.

![Alt Text](/redis-image/3.png)
