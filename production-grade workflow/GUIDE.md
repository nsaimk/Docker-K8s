**Table of Contents**
1. [Instruduction of the Module](#1-instruduction-of-the-module)
2. [The Flow Specifics](#2-the-flow-specifics)



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