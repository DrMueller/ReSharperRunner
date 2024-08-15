import { FailTreshholdLevel } from "../parameters/fail-treshhold-level";
import { EntryLevel } from "../parsing/models/entry-level";
import tl = require('azure-pipelines-task-lib/task');
import { ResultEntry } from "../parsing/models/result-entry";

export class AnalysisLogger {
    public logErrors(
        resultEntries: ResultEntry[],
        minimumFailLevel: FailTreshholdLevel): boolean {

        let levelsToCheck = [
            EntryLevel.Information,
            EntryLevel.Warning,
            EntryLevel.Error
        ];

        if (minimumFailLevel !== FailTreshholdLevel.Information) {
            levelsToCheck = levelsToCheck.filter(f => f !== EntryLevel.Information);
        }

        if (minimumFailLevel !== FailTreshholdLevel.Warning) {
            levelsToCheck = levelsToCheck.filter(f => f !== EntryLevel.Warning);
        }

        tl.debug(`checking for levels: ${levelsToCheck.join(', ')}`);

        let doFailTask = false;
        levelsToCheck.forEach(level => {
            const checkFoundFailures = this.logEntries(resultEntries, level);
            if (checkFoundFailures) {
                doFailTask = true;
            }
        });

        return doFailTask;
    }

    private logEntries(resultEntries: ResultEntry[], logLevel: EntryLevel): boolean {
        const foundEntries = resultEntries.filter(entry => entry.level === logLevel);
        tl.debug(`Found ${foundEntries.length} entries for logLevel: ${logLevel}`);

        if (foundEntries.length > 0) {
            foundEntries.forEach(entry => {
                entry.locations.forEach(location => {
                    const message = `Type:${logLevel};file:${location.uri};line:${location.startLineDescription};message:${entry.message}`;
                    tl.debug(message);
                    if (logLevel == EntryLevel.Information) {
                        tl.warning(message);
                    }
                    else if (logLevel == EntryLevel.Warning) {
                        tl.warning(message);
                    } else if (EntryLevel.Error) {
                        tl.error(message);
                    }
                });
            });

            return true;
        }

        return false;
    }
}