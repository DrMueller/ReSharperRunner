import tl = require('azure-pipelines-task-lib/task');

import { AnalysisRunner } from './analysis/services/analysis-runner';
import { AnalysisLogger } from './logging/analysis-logger';
import { FailTreshholdLevel } from './parameters/fail-treshhold-level';
import { ResultParser } from './parsing/services/result-parser';

async function run() {
  try {
    const solutionPath: string | undefined = tl.getInput('solutionPath', true);
    const thresholdForFailure = tl.getInput('thresholdForFailure', true);
    let additionalArguments = tl.getInput('additionalArguments', false);

    // const solutionPath = '""C:\\MyGit\\Kunden\\Modan\\Feldkalender2\\Feldkalender2.sln""';
    // const thresholdForFailure = 'warning';
    // let additionalArguments = '';

    tl.debug(`solutionPath: ${solutionPath}`);
    tl.debug(`thresholdForFailure: ${thresholdForFailure}`);
    tl.debug(`additionalArguments: ${additionalArguments}`);

    additionalArguments = additionalArguments?.replace("\"", "''");

    tl.debug(`Parsing failure treshhold..`);
    const minimumFailLevel = parseFailLevel(thresholdForFailure!);
    tl.debug(`Failure treshhold parsed..`);

    const runner = new AnalysisRunner();
    const analysisResult = await runner.runAnalysisAsync(solutionPath!, additionalArguments);
    tl.debug(`Analysis ran..`);

    if (!analysisResult.jsonContent) {
      tl.debug(`Failing as ReSharper didn't work.`);
      tl.setResult(tl.TaskResult.Failed, 'ReSharper analysis didn\'t prduce any output');
      return;
    }

    const resultEntries = new ResultParser().parseData(analysisResult.jsonContent!);
    tl.debug(`Data parsed. ResultEntries length: ${resultEntries.length}`);

    const doFailTask = new AnalysisLogger().logErrors(resultEntries, minimumFailLevel);
    tl.debug(`Errors logged..`);

    if (doFailTask) {
      tl.setResult(tl.TaskResult.Failed, "Errors found");
    }
  }
  catch (err: any) {
    const errMessage = `Name: ${err.name}. Message: ${err.message}. Stack: ${err.stack}`;
    tl.setResult(tl.TaskResult.Failed, errMessage);
  }

  function parseFailLevel(level: string): FailTreshholdLevel {
    switch (level.toLowerCase()) {
      case "information":
        return FailTreshholdLevel.Information;
      case "warning":
        return FailTreshholdLevel.Warning;
      case "error":
        return FailTreshholdLevel.Error;
      default:
        throw new Error(`Unknown level: ${level}`);
    }
  }
}

run();