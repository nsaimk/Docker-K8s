**Table of Contents**
1. [Instruduction of Project](#1-instruduction-of-project)
2. [Assembiling Dockerfile and Docker Compose](#2-assembiling-dockerfile-docker-compose)
3. [Docker Compose File](#3-docker-compose-file)
4. [Networking with Docker Compose](#4-networking-with-docker-compose)
5. [Docker Compose Commands](#5-docker-compose-commands)

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


3. Docker Compose File

We have two options here; first we can use Docker CLI's, that built in Docker CLI has functionality tied to it that will allow us to set up a network between two separate containers. However, it will involve different commands that have to be reran every single time we start up our different containers.

The second option is using a separate CLI tool called Docker Compose. Docker Compose is a separate tool that gets. installed along with Docker. So Docker Compose makes it very easy to start up multiple Docker containers at the same time, and automatically connect them together with some form of networking.

![Alt Text](/multipleContainer/assets/docker_compose.png)

To make use of Docker Compose, we use the same build and run commands we ran before. But we encode these commands in a special file in our directory, called `docker-compose.yml`. Once we create this file, then we feed it into the Docker Compose CLI and it is up to the CLI to parse that file and create all the different comtainers with the correct configuration that we specify.

docker-compose.yml:
```
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    build: .
    ports:
      - "8081:8081"
```

- 'services', service means a type of container. We have two services inside our docker-compose.yml file. We are defining two services inside our docker-compose file, and both these services take the form of these different Docker containers. 

- So we use redis-server, and specify the image that we want docker-compose to use which is redis image.

- We want the 'node-app' container to be built using the Dockerfile inside the current directory, so rather than specifying an image, we say `build .` that means look in the current directory for a Dockerfile and use it to build this image.

- Then we specify all the different ports that we want to have be opened up on the node-app container.

.
---


4. Networking with Docker Compose

How we can take the docker-compose.yml file and create the two separate containers? By just defining two services inside the docker-compose.yml file, it automatically create both these containers on the same network, and they have free access to communicate to each other.

The port decleration in the docker-compose.yml file is to open up access to our container on our local machine. We don't have to do any additional steps to connect them, like port command on terminal.

But how do we actually access the Redis server from our Node.js code? To do that we need to add a location of the Redis server that we are running in the index.html file. And we can connect  the Redis server container by referring to it by its name of 'redis-server' in docker-compose.yml file.

```
const client = redis.createClient({
    host: 'redis-server',
    port: 6379
});
```
.
---


5. Docker Compose Commands

To run containers: `docker compose up`

To stop all running containers: `docker compose down`

We can add restart policy in our docker-compose file in cases below:
 - "no": never attemp to restart this. container if it stops or crashes(only no policy written in quotation mark)
 - always: if this container stops for any reason always attempt to restart it
 - on-failure: only restart if the container stops with an error code
 - unless-stopped: always restart unless we forcibly stop it

Example policy in docker-compose file:

```
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    restart: "no"
    build: .
    ports:
      - "8081:8081"
```

Running containers: `docker compose ps` (this command works only in the directory which docker-compose file located)
---

The End.