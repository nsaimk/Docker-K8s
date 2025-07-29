**Table of Contents**
1. [Instruduction of Project](#1-instruduction-of-project)


1. Instruduction of Project

The purpose of this application is to make a Docker container that contains a web qpplication that simply displays inside the browser the number of times that someone has visited this server.

![Alt Text](/multipleContainer/assets/app_main_page.png)

In order to build this app, We need two components. First off, a web server that responses to HTTP requests. And to store the number of visited times, we are going to use Redis server. Redis is a in memory data store, kind of a tiny database that sits inside the memory.

![Alt Text](/multipleContainer/assets/app_components.png)

We can achive the purpose of this app with a single container that run Node application and a Redis server inside of it because we don't expect too much traffic. But if this application would get a high volume traffic, we would want to introduce more web applications servers to respond the incoming HTTP requests. So this is our case in this project.

What we are going to have separate Docker containers for multiple Node applications and the Redis server.

![Alt Text](/multipleContainer/assets/multiple_containers.png)

However, because of we don't worry about scaling yet, we are going to set up single Node app container.

![Alt Text](/multipleContainer/assets/app_components.png)


The End.