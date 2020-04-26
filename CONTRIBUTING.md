# Contributing

Contributing to this project is easy and we welcome anyone able to help maintain the project. We do ask that, in the course of your development, you adhere to a set of standards. This will help ensure the project runs smoothly and helps lower the bar for new developers to the project.

## Gitflow

This project uses the ideas and standards set forth in GitFlow. If you are unfamiliar with those ideas and standards, we recommend you take a quick look through some [documentation](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

To make it easy on all the developers involved in this project, we have opted to use a set of Git extensions called HubFlow. To ensure standards, we do require that these tools be used for all branching. HubFlow has a great set of [documentation](https://datasift.github.io/gitflow/IntroducingGitFlow.html) on how it helps developers maintain a cleaner code base and adhere to the GitFlow ideas and standards.

### Mac Installation

For quick reference to developers working on the Mac OSX platform, installation of the HubFlow extensions is as simple as executing `brew install hubflow`.

### Branching Quick Reference

Remember to never commit directly to the master or develop branches. All code should live in a feature, release, or hotfix branch. Once development is done, pull requests will be used to merge the feature, release, or hotfix branch into the master and develop branches.

## Testing and Code Coverage

Developers will be expected to write tests for all source code commited to the repository. It is the job of every developer to ensure that tests exist and execute properly when a pull request is submitted. It is also the job of every developer to ensure that an appropriate number of tests have been written and the quality of those tests ensure we meet code coverage requirements. To make this easier, reports for test completion and coverage are provided.

In addition to tests and code coverage, the project also contains TypeScript and SASS linting. Linting should be executed at the same time as tests and issues must be corrected before a pull request is accepted.

### Commands

```bash
npm test
npm run lint
```

## Developing / Building

To start up a local development instace of the project, execute the ```npm start``` command. To complete a build of the application resulting in deployable code files, use the below commands.

```bash
production: NODE_ENV=production npm run build
development: NODE_ENV=development npm run build
test: NODE_ENV=test npm run build
```

## Versioning

The code base makes use of semantic versioning 2.0.0. Please make sure you are familiar with semantic versioning. If you need to review, please see the [documentation](http://semver.org/).