**Table of Contents**
1. [Instruduction of Project](#1-instruduction-of-project)
2. [Assembiling Dockerfile and Docker Compose](#2-assembiling-dockerfile-docker-compose)

---


1. Instruduction of Project

The purpose of this application is to make a Docker container that contains a web qpplication that simply displays inside the browser the number of times that someone has visited this server.

![Alt Text](/multipleContainer/assets/app_main_page.png)

In order to build this app, We need two components. First off, a web server that responses to HTTP requests. And to store the number of visited times, we are going to use Redis server. Redis is a in memory data store, kind of a tiny database that sits inside the memory.

![Alt Text](/multipleContainer/assets/app_components.png)

We can achive the purpose of this app with a single container that run Node application and a Redis server inside of it because we don't expect too much traffic. But if this application would get a high volume traffic, we would want to introduce more web applications servers to respond the incoming HTTP requests. So this is our case in this project.

What we are going to have is separate Docker containers for multiple Node applications and the Redis server.

![Alt Text](/multipleContainer/assets/multiple_containers.png)

However, because of we don't worry about scaling yet, we are going to set up single Node app container.

![Alt Text](/multipleContainer/assets/app_components.png)


---

2. Assembiling Dockerfile and Docker Compose

We created the Dockerfile and built a new image with `docker build -t multiplecontainer:first .` command for our application. Then run the container `docker run <image id>`. But we got this error:

![Alt Text](/multipleContainer/assets/redis_error.png)

The error is about our server is attempting to start up but there is no Redis server running for it to connect to. So we need to get a separate container running a Redis server. To do it we run `docker tun redis`. This command is going to reach out to the Docker Hub, pull down the Redis instance, and it will start up a copy of Redis on our local machine. Now Redis server is running.

While Redis server is running, I open up a second terminal and run the command `docker run -p 8081:8081 <image id>`. This time i got this error:

![Alt Text](/multipleContainer/assets/connection_error.png)

Here is what's going on our computer right now. We have Node application in one container, and the Redis application in the separate Docker container. But these two container do not have any automatic communication between the two. They are two absolutely isolated processes. So in order to make sure that our Node app has the ability to reach out to the Redis server and store information, we need to set up some networking infrastructure between them.


---


The End.