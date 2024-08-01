import { ResultEntry } from "../models/result-entry";
import { ResultEntryLocation } from "../models/result-entry-location";
import tl = require('azure-pipelines-task-lib/task');
import { EntryLevel } from "../models/entry-level";

export class ResultParser {
    public parseData(jsonContent: string): ResultEntry[] {
        const parsedData = JSON.parse(jsonContent);
        const resultEntries: ResultEntry[] = [];

        parsedData.runs.forEach((runData: any) => {
            runData.results.forEach((result: any) => {
                tl.debug(JSON.stringify(result));
                
                const locations: ResultEntryLocation[] = [];
                result.locations.forEach((location: any) => {
                    locations.push(new ResultEntryLocation(
                        location.physicalLocation.artifactLocation.uri,
                        location.physicalLocation.region.startLine));
                });

                const entry = new ResultEntry(
                    this.parseLevel(result.level),
                    result.message.text,
                    locations);

                resultEntries.push(entry);
            });
        });

        return resultEntries;
    }

    private parseLevel(level: string): EntryLevel {
        switch (level.toLowerCase()) {
            case "note":
                return EntryLevel.Note;
            case "information":
                return EntryLevel.Information;
            case "warning":
                return EntryLevel.Warning;
            case "error":
                return EntryLevel.Error;
            default:
                throw new Error(`Unknown level: ${level}`);
        }
    }

}