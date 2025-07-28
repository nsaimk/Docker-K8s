Goal of the project is to create a Node.js application, wrap it inside of a Docker container, and then be able to access that web application from a browser running on our local machine. Don't worry about deploying this app right now, we just focus on getting Node.js to work inside of a Docker container.

![Alt Text](/project/assets/steps.png)

Important Note: Buildkit will hide away much of its progress which is the legacy builder did not do. To see this output, we will want to pass the progress flag to the build command: `docker build --progress=plain .`

To disable Buildkit, you can just pass the following variable to the build command: `DOCKER_BUILDKIT=0 docker build .`

So I created the Dockerfile. Then ran `docker build .` command inside the simpleWeb directory.