# Election Result Parser

This a simple utility that reads in St. Louis, MO [election result PDFs](https://www.stlouis-mo.gov/government/departments/board-election-commissioners/elections/election-results.cfm) and parses them into JSON blobs, which are easier to work with. Note that currently, this only supports the "Official Results Summary" documents found on the above website.

## Usage

To download the utility, you can either clone this repository via Git, or simply download a .zip of the source code. Just click the green `Clone or Download` button on the GitHub repository's page, which gives you instructions on how to do either of those options.

The utilty is written in JavaScript, and can be run by using [Node.js](https://nodejs.org/). There hasn't been any extensive testing, but the program should work with most newer versions of Node, on any platform. We recommend getting either the LTS (long term support) or Latest version of Node.js from [here](https://nodejs.org/en/download/).

Once you've got a working version of node installed (you can verify this by running `node --version` on the command line), you can run the program using the following command:

```shell
node index.js /path/to/pdf/file
```

This will output a JSON string to stdout - you'll likely want to store the data so that you can use it later: a common use case would be to store it into a file:

```shell
node index.js results.pdf > parsed_results.json
```

## Contributions

Contributions are welcome for this project! Please check the [Issues Page](https://github.com/miec-stl/election-result-parser/issues) first to see if the feature or bug you're planning on working on is already in progress. Feel free to open an issue to gauge interest in a potential feature as well!

We use Prettier for file formatting - settings for the project should be set in the `package.json`, so all need to do is install a [Prettier plugin](https://prettier.io/) for your development environment.

## Reporting Issues

If you find a bug with any part of the utilty, please [submit an issue](https://github.com/miec-stl/election-result-parser/issues/new) describing the bug and steps to reproduce (if available).
