export class ResultEntryLocation {
    constructor(public uri: string, private startLine: number | null) { }

    public get startLineDescription(): string {
        if (this.startLine) {
            return this.startLine.toString();
        }

        return '-';
    }
}