**Table of Contents**
1. [Instruduction of the Module](#1-instruduction-of-the-module)
2. [The Flow Specifics](#2-the-flow-specifics)
3. [Creating the Dev Dockerfile](#3-creating-the-dev-dockerfile)
4. [NOTE](#4-note)
5. [Starting the Container](#5-starting-the-container)
6. [Docker Volumes](#6-docker-volumes)
7. [Docker Compose](#7-docker-compose)
8. [Do We Need COPY?](#8-do-we-need-copy)
9. [nginx](#9-nginx)


## 1. Instruduction to the Chapter

How do we actually use Docker in a production type environment. How do we develop an application that uses Docker, and then push it some outside hosting service like AWS. In this chapter we are going to study developing production workdlow and how Docker get involved in this process. This understanding will help us to understand role of Docker inside the workflow.

When I say workflow I mean development, testing, and deployment. And at some point in the future, doing some additional development, additinal testing, and redeploying the application.
---


## 2. The Flow Specifics

- We are going to use `feature` and `main` branches on github. Master branch is working copy of our code base. Any changes that we make to this main branch are going to be automatically deployed out to our hosting provider.

We don't push our changes to the main branch, we do to any other branch, feature in our case, then create a pull request for those changes into the main branch. And two important things occur. First, we are going to set a workflow that is automatically takes our application and push it over to a service called `Travis CI`. Travis CI is a continuous integration provider. It pulls down our code and run a set of tests that we write on our code base. After Travis CI run tests successfully, we can merge all changes over the main branch.

After merging, we push our code over to Travis CI, test one more time.

After Travis CI run tests successfully, it then sets up to automatically take our code base and push it over to AWS hosting. Essentially to a service called Elastic Beanstalk.

So this is our flow.
---


## 3. Creating the Dev Dockerfile

We installed a React application. 

We are going to have two different Docker files. One will be responsible for running our application in development, the other in production.

In this section, we start on the Dockerfile that runs our application in development.

We create a `Dockerfile.dev` file. The purpose of the '.dev' on the end of the Dockerfile is to make sure it is clear that this Dockerfile is only used when we run our application in a development environment. In the future, we are going to put together a second Dockerfile for running our application in production, and it is going to have a name of simply Dockerfile. Otherwise, if we run locally and actively develop our application, we will build our image and start up our container using Dockerfile.dev file.

I created Dockerfile.dev at this point.

I ran this command to build an image of our application: 

- `docker build -f Dockerfile.dev -t workflow:first .`
-f means that we specify the file that's going to be used to build out the image.
---


## 4. NOTE

In previous chapters we did not install any of our dependencies into our working directory. Instead, our Docker image installed those dependencies when the image was initially created. So now, we have two copies of dependencies, and we don't need two. So we can delete `node_modules` folder inside our directory.
---


## 5. Starting the Container

I ran `docker run <image ID>`, and got this output on my terminal:

![Alt Text](/production-grade%20workflow/assets/localhost.png)

But when I visited the localhost:3000, the page says 'This site can’t be reached'. Anytime we want to expose a port from our Docker image or Docker container to our machine, we have to add on `-p` flag to map out the ports we want to expose.

So I took port 3001 on my local machine and map it up to port 3000 inside the container:
`docker run -p 3001:3000 <container ID>`, it started.
---


## 6. Docker Volumes

In this section, we are going to make a little change to the source code of the react project. On `frontend/src/App.js` file, i just changed a text to 'hi there!' while the contianer is running. Then I refreshed the page, but my change did not occur. Because when we start up our image or initialy create the image, we are taking a snapshot of all of the source code inside of our project directory and we are building our image with that snapshot. So if we want to get changes to be reflected inside of our container after we make a change, we need to either rebuild the image or we can use Docker Volume. Of course we don't want to rebuild the image every time we make a change to our source code. We want to do it without having to stop the container, rebuild the imamge, and then restart the container. 

With Docker Volumes, rather than doing the straight copy, we are going to adjust the Docker run command that we used to start up our running container. By adjusting this commnad, we are going to be making use of Docker Volumes. With a Docker Volume we set up a placeholder(In computing, a placeholder is a character, symbol, or text string that temporarily represents something else, often until the final or actual value is known or available.) inside of our Docker container, so we no longer copy over the entire `/src` directory or the entire public directory. Instead, we put a kind of reference into the snapshot. The Volume sets up a reference that points back to our local machine and gives us access to the files and folders inside of the folders on the local machine. So a Docker Volume can be kind of be thought of port mappings. The port mapping maps a port inside the container to a port outside the container. With a Docker Volume, we set up a mapping from a folder inside the container to a folder outside the container.

![Alt Text](/production-grade%20workflow/assets/volume_command.png)

`docker run -p 3001:3000 -v /app/node_modules -v "$(pwd)":/app <image ID>`

- `-v "$(pwd)":/app`: '-v' sets up a volume, '$' presents working directory that we say that get the present working directory and take the folder on the path and everything inside of it, and map it up to the app folder running inside of our container.

- `-v /app/node_modules`: if we run the whole command without this switch we get an error says  `react-script: not found`. The issue here is that when we set up volume, we said that take everthing inside of our working directory and map it up to the app folder inside of our container. But remember, inside of our current directory we don't have node_modules folder which is where all of our dependencies exist, because we deleted it in a previous section. So the node_modules folder inside the container is overwritten. When we set up volume mapping, we said to Volume that 'anytime you tried to reference node_modules, just go ahead and try to look at the copy of node_modules that is back inside of the front end folder'. But we deleted it. So we get this reference that points back to nothing on the local operating system. To fix it, we pass in an additional '-v' flag and as the only argument or the only folder path on there we said `app/node_modules`. We didn't use a colon. Because, when we use the colon syntax, we say that we want to map up a folder inside the container to a folder outside the container. When we do not use the colon, we are saying 'we want this(node_modules) to be a placeholder for the folder that inside the container. Don't try to map it up against anything.'

So when we use the `-v` flag in `-v "$(pwd)":/app` part, we say that anytime the container tries to access something in the app directory, reach back out of the container to the currect or the present working directory(the pwd) on our local machine. And we did not want to overwrite access to the node_modules that we had already installed into our container.
---


## 7. Docker Compose

In last section, we made use of Docker Volumes to automatically get changes that we make to our source code reflected inside the container. Only downside of it was the long docker run command. Even though we have a single Docker image, we can still make use of Docker Compose to simplify the command we have to run to start up Docker container for development purposes. 

So let's create a `docker-compose.yml` file and inside that file we are going to encode the port setting, and the two volumes that we need to create inside the container.

I created the `docker-compose.yml` file and just ran `docker compose up` command but i got this error: 'failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory'. Because when I put together our initial service in the docker-compose.yml file, I wrote 'build .' that uses the current directory, but we don't have a Dockerfile inside the current directory. We have a Dockerfile.dev file. 

current docker-compose.yml file:
```
version: '3'
services:
  react-app:
    build: .
    ports:
      - "3001:3000"
    volumes:
      - /app/node_modules
      - .:/app
```

So how can we force Docker compose to build our image for the `react-app` service using .dev file. For the 'build', rather than saying just look into the current working directory, with '.', for that docker file, we are going to replace that dot with two additional options. 

First one, we are going to add a context. This context option is specifying where we wnat all the files and folders for this image to be pulled from. We want all the files and folders for our project to come form the same directory as docker compose or essentially the current working directory. To indicate that we will add a dot.

Second option is saying dockerfile that is the location of the docker file that's going to be used to construct the image for our react-app service.

```
version: '3'
services:
  react-app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3000"
    volumes:
      - /app/node_modules
      - .:/app
```

Back in my terminal, and run the command `docker compose up` again that is going to start up our single container and it is going to set up two different volume mounts inside of it, one to kind of bookmark or hold onto the reference to node modules locally inside the container, and the other to map up all of our source code files on our local machine into the container's app directory. Now it's successfully built.
---


## 8. Executing Test

In this section we are on testing stage of the workflow.

- One of the ways testing, while running the docker compose with `docker compose up`, in a second terminal to run `docker exec -it <conatiner ID> npm run test`. It will be updated in live anytime we made a change on the test file.

- Another way is creating a second service in docker-compose.yml file.

```
version: '3'
services:
  react-app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3000"
    volumes:
      - /app/node_modules
      - .:/app
  tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm", "run", "test"]
```

So when I run `docker compuse up`, we are going to start up one container that's going to be responsbile for hosting our development server, and the second container that is going to be responsible for running our tests and rerunning any time that any file inside of our volumes change.

But downside of this second approach is that we don't have the ability to enter any standart in output to that container. So We cannot hit enter to get the test suite to rerun, or w to get any of the options and so on.

With docker attach, we can forward input from our terminal directly to a specific container. So while docker-compose.yml file that contains the test service is ran by `docker compuse up` command, I opened up a second terminal and ran `docker attach <conatiner ID>`. And what we got is that the cursor on terminal is just hovering there. It's not working as we expected. Because when we use docker compose, we are not able to manupilate our test suite by entering p, t, q special commands.

But Why? Let's start up a shell instance inside the running container. Run `docker exec -it <container ID> sh`. '-it' means that we are starting up a connection to `stdin`. Then I run `ps` which prints out all running processes that we have going on inside the container.

![Alt Text](/production-grade%20workflow/assets/testing.png)

Notice how we have a PID of 1 for the command 'npm run start'. We have also got a seperate process running for 'react-scripts start', and so on. So why is the text that we were entering into the attached window not showing up? Because all that different processes have been created inside the container. So when we run 'npm run test', we are actually running process npm. And then the npm looks at the additional arguments we are providing, specifically run test, and uses those additional arguments to decide what to do. So npm starts up a second process that is actually running our tests.

When we run docker attach, we always attach to stdin of the primary process of the container with the PID(process id) of 1. So it is always the npm command. With docker attach, we always get a handle on the primary process, not the secondary. So it is not an option!
---


## 9. nginx

Till now we have put together an implementatiton for `npm run start` and `npm run test`. It is now to think about how we are going to treat our Docker container in a production environment where we are supposed to be running `npm run build`. Reminder, `npm run build` builds a production version of the application. It takes all the JavaScript files, process them all together, puts them all together into a single file and then spits it out to a folder on our hard drive.

This is a pretty important distinction because it changes the mechanics behind how our application is served up in a development and production environment. 

![Alt Text](/production-grade%20workflow/assets/dev_env.png)

The diagram above shows how our application runs on development environment. Inside our web container, we have a development server. Whenever our browser makes a request to port 3001 on local host, it is making request to that `Dev Server`. Then the development server takes the `index.html` file and the `main.js` file, and sends them back over to the browser. So the development server is %100 required in the development environment.

But when we move over to the production environment, the `Dev Server` falls away. We instead run `npm run build` one time and that gives us that `index.html` file and the `main.js` file that we need to communicate to our user's browser. 

As a quick aside, the `Dev Server` falls away because it is not appropriate to be running in a production environment. Because it has a ton of processing power inside of it dedicated to processing these JavaScript files. And this is something we don't need to do when we are running in production, because we are no longer making any changes to the JavaScript code of our project.

So, what we need for our production environment is some type of server here whose sole purpose is to repond to browser requests with that JavaScript files. To solve this, we are going to be making use of a server called `nginx`. Nginx is a very popular web server that takes incoming traffic and reponding to it with some static files.

So we are going to create a seperate Dockerfile that is going to create a production version of our web container. 

![Alt Text](/production-grade%20workflow/assets/nginx.png)

So how we get nginx as our web server? We already created a file called `Dockerfile.dev`. The purpose of this file was to create an image that could be used in the development environment. Now we are going to create a second Dockerfile. It is goint to make a second image that going to run our applicatoin specificly in production.

![Alt Text](/production-grade%20workflow/assets/nginx_dockerfile.png)

- We need to use Node Alpine as a base image because we do have to run `npm run build` command.
- In order to run `npm run build`, we have to install all of our dependencies from the `package.json` file. We will copy the `package.json` file.
- We install the dependencies, and once we have those dependencies installed we will be able to execute `npm run build` command.
- After running `npm run build` and generating our production assets, we will start up the Nginx server and serve the result of that build directory.

But there are two issues in this diagram. The first issue is the installed dependency step. The dependencies only required when we build the application. After that, they no longer required. It would be really nice to avoid carrying around 150 mbs worth of dependencies.

The other issue with the diagram flow is where is the Nginx coming from. What point time does it get installed? At this point, we had already made use of `node apline` inside of our contianer, so it would be really nice to be able to have two different base images.

So here is the plan:

![Alt Text](/production-grade%20workflow/assets/dockerfile_plan.png)

We are going to build a Dockerfile that has `multi-step build process`. Inside the Dockerfile, we are going to have two different block of configuration. Build phase and run phase. 

The 'build phase' uses the node alpine image as base, copies over the package.json file, installs dependencies, and then executing `npm run build`. The result of all that is going to be our JavaScript files that we need to serve up our application in a production environment.

With the second block, run phase, we get the ability to specify a second base image that we are going to use Nginx as the base image. Then we are going to reach over from the run phase to the build phase and say that out of everything that occured during the build phase, we want to get the build directory that has the JavaScript files. So we are going to take the result of all build phase, and we are going to copy it over to our `npm run build` phase. When we copy that, everything else that occured during the build phase, like the alpine image, dependencies installed.., will get dropped out of the final result of our container. So after we copy that directory over, we start Nginx, and we will be using Nginx as the base image.

So I created Dockerfile:

```

```

- By putting on `as builder`, that means from the FROM command and everything underneath it is all going to be referred to as builder phase, so install all dependencies and build our application.

- After `RUN npm run build` instruction, `build` folder will be created in the working directory.

- As default command of nginx image starts up the nginx for us, we do not need to specify a RUN instruction for nginx in our Dockerfile.

So that's it. This is our Dockerfile for production environment. Let's test it.

I run `docker build .` command in my working directory path on my terminal. The image is created. Then i run `docker run -p 8080:80 <image ID>` command, we have to open up our ports here, because nginx is a web server, it wants to start up traffic, so I added ports `8080` to route the traffic, and `80` is default port that nginx uses, as the source port inside the container. So we are going to map up 8080 on our machine to 80 inside the container.
---

The End.