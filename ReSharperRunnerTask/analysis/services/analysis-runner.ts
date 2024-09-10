import { spawn } from 'child_process';
import { AnalysisResult } from '../models/analysis-result';
import { existsSync, unlinkSync, readFileSync } from 'fs';
import tl = require('azure-pipelines-task-lib/task');

export class AnalysisRunner {
    public async runAnalysisAsync(
        solutionPath: string,
        additionalArguments: string | undefined): Promise<AnalysisResult> {

        return new Promise((resolve) => {
            const outputFile = 'output.json';

            // Wenn die Datei bereits existiert, löschen
            if (existsSync(outputFile)) {
                unlinkSync(outputFile);
            }

            const argsArray = ['inspectcode', solutionPath, `-o=${outputFile}`, additionalArguments ?? ''];
            const process = spawn('jb', argsArray);
            tl.debug(argsArray.join(', '));

            process.stdout.on('data', (data) => {
                console.log(`${data}`);
            });

            process.stderr.on('data', (data) => {
                console.error(`${data}`);
            });

            process.on('close', (exitCode) => {
                if (exitCode !== 0) {
                    console.error(`Process exited with code ${exitCode}`);
                    resolve(new AnalysisResult(null));
                } else if (!existsSync(outputFile)) {
                    resolve(new AnalysisResult(null));
                } else {
                    const jsonData = readFileSync(outputFile, 'utf-8');
                    resolve(new AnalysisResult(jsonData));
                }
            });
        });
    }
}