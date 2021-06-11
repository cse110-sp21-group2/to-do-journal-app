This is the documentation for our onboarding procedures.

# Project Guidelines &middot;


## 1. Git


<a name="some-git-rules"></a>

### 1.1 Some Git rules

There are a set of rules to keep in mind:

- Perform work in a feature branch. [read more...](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow)


- Branch out from `dev`


- Never push into `dev` or `master` branch. Make a Pull Request.


- Resolve potential conflicts that arise during a Pull Request.


- Before merging a Pull Request, make sure your feature branch builds successfully and passes all linting and code style checks.

 
- You will need to ask someone from the team for the `.env` file. 

### 1.2 Git workflow

- Checkout a new feature/enhancement/fix branch.
  ```sh
  git checkout -b <branchname>
  ```
- Make Changes.

  ```sh
  git add <file1> <file2> ...
  git commit
  ```
 
- Push your changes.
- Make a Pull Request.
- Resolve any merge conflicts that may come up as well as build / linting issues
- Pull request will be accepted, merged and close by a reviewer.
- Remove your local feature branch if you're done.

  ```sh
  git branch -d <branchname>
  ```

### 1.3 Build process

- Within the main directory run:
  ```sh
  npm install
  ```
- This will download all the necessary node modules for starting the application

- After the packages are finished installing, Within the main directory run:
  ```sh
  npm start
  ```


## 2. Eslint
- Install the [ESlint plugin](https://eslint.org/docs/user-guide/integrations) for your IDE to catch linting errors while developing the feature.

* Ideally, remove any of your `eslint` disable comments before making a Pull Request.

    
## 3. Reusable Components
* Every folder will have an ```index.js``` with imports and exports.
* Components folder: ```./client/components ```.
