# sprint-pci

This repo contains all the functionality involved in maintaining sprint pci payment.
## Requirements

* Maven `brew install maven`, check if installed via `mvn -v`
* Node 10 & NPM 6.

## Install

1. From the root directory, run `npm install` to install node packages. Note: Node 10 & NPM 6 required.
2. From the root directory, run `mpm run aem:build` to install and build to your local AEM environment.

## Build Commands:

#### root
These commands only work out of your root directory.

| Command     | What happens? |
| ----------- | ------------- |
| `npm start` | Starts the local node development build and watch tasks.  When files change, they are automatically deployed to the local running AEM instance.              |
| `npm run aem:build` | Builds the AEM package based on this branch, and installs it into your local running AEM instance.     |
| `npm run sonar` | Pushes this branch's code up to the Sprint SonarQube server for analysis. Watch the console results for the location of the results.     |
| `npm run sonar-coverage` | Same as sonar above, but runs Jest test coverage command first so you can see the code coverage in the SonarQube report.     |
| `npm run test` | Runs all of the unit tests in the branch.  |
| `npm run type-check` | Runs a TypeScript type check against all .ts files.  This happens during commits, but it helpful to run standalone during coding session.  |
| `npm run test:watch` | Runs jest in a 'watch' configuration, only running tests against the files you specify. |


## Using with AEM Developer Tools for Eclipse

To use this project with the AEM Developer Tools for Eclipse, import the generated Maven projects via the Import:Maven:Existing Maven Projects wizard. Then enable the Content Package facet on the _content_ project by right-clicking on the project, then select Configure, then Convert to Content Package... In the resulting dialog, select _src/main/content_ as the Content Sync Root.

## Using with VLT

To use vlt with this project, first build and install the package to your local CQ instance as described above. Then cd to `content/src/main/content/jcr_root` and run

    vlt --credentials admin:admin checkout -f ../META-INF/vault/filter.xml --force http://localhost:4502/crx

Once the working copy is created, you can use the normal ``vlt up`` and ``vlt ci`` commands.

*This a content package project generated using the sprint-aem-project lazybones template.*
