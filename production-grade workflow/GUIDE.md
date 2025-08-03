**Table of Contents**
1. [Instruduction of the Module](#1-instruduction-of-the-module)
2. [The Flow Specifics](#2-the-flow-specifics)
3. [Creating the Dev Dockerfile](#3-creating-the-dev-dockerfile)
4. [NOTE](#4-note)
5. [Starting the Container](#5-starting-the-container)
6. [Docker Volumes](#6-docker-volumes)

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