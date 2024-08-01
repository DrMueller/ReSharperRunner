import { EntryLevel } from "./entry-level";
import { ResultEntryLocation } from "./result-entry-location";

export class ResultEntry {
    public constructor(
        public level: EntryLevel,
        public message: string,
        public locations: ResultEntryLocation[]) {}
}

