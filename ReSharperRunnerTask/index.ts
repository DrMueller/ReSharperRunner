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

    tl.debug(`solutionPath: ${solutionPath}`);
    tl.debug(`thresholdForFailure: ${thresholdForFailure}`);
    tl.debug(`additionalArguments: ${additionalArguments}`);

    additionalArguments = additionalArguments?.replace("\"", "''");
    const minimumFailLevel = parseFailLevel(thresholdForFailure!);

    const runner = new AnalysisRunner();
    const analysisResult = await runner.runAnalysisAsync(solutionPath!, additionalArguments);
    if (!analysisResult.jsonContent) {
      tl.debug(`Failing as ReSharper didn't work.`);
      tl.setResult(tl.TaskResult.Failed, 'ReSharper analysis didn\'t prduce any output');
      return;
    }
    const resultEntries = new ResultParser().parseData(analysisResult.jsonContent!);
    tl.debug(`resultEntries: ${resultEntries.length}`);

    const doFailTask = new AnalysisLogger().logErrors(resultEntries, minimumFailLevel);
    tl.debug(`doFailTask: ${doFailTask}`);

    if (doFailTask) {
      tl.setResult(tl.TaskResult.Failed, 'Errors found');
    } else {
      tl.setResult(tl.TaskResult.Succeeded, 'Everything is awesome');
    }
  }
  catch (err: any) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }

  function parseFailLevel(level: string): FailTreshholdLevel {
    switch (level.toLowerCase()) {
      case "information":
        return FailTreshholdLevel.Note;
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