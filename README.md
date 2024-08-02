# ReSharper Runner

## Features

Runs the [ReSharper InspectCode command line tool](https://www.jetbrains.com/help/resharper/InspectCode.html) and analyses its result.

## Restrictions

- The task expects the command line tool to be installed, please make sure this is the case.
- The task expects the newly added output format SARIF, therefore this only works with ReSharper 2024 and forward

## Configuration

### Solution path

Path to the solution to analyze.

Defines whether the scan also checks the transitive dependencies.

### Threshold for failure

Defines the threshold, when the task should fail.

### Additional arguments

Additional arguments, passed to ReSharper CLT.

## Contributing

If you have any questions, fixes or enhancements, please create a pull request or an issue.
[Github](https://github.com/DrMueller/ReSharperRunner)

## History

Please see the commit history.

## License

This software is released under [MIT License](http://www.opensource.org/licenses/mit-license.php).