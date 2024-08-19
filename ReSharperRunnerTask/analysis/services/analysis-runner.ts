const { exec } = require('child-process-async');
import { AnalysisResult } from '../models/analysis-result';
import { readFileSync } from 'fs';
const fs = require('fs');

export class AnalysisRunner {
    public async runAnalysisAsync(
        solutionPath: string,
        additionalArguments: string | undefined): Promise<AnalysisResult> {
        const outputFile = 'output.json';
        let command = `jb inspectcode ${solutionPath} -o=${outputFile}`;

        if (additionalArguments) {
            command += ` ${additionalArguments}`;
        }

        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }

        // Maxbuffer seems required on certain machines, see https://stackoverflow.com/questions/23429499/stdout-buffer-issue-using-node-child-process
        const { stdout, stderr } = await exec(command, { maxBuffer: 1024 * 500 });

        console.log('Standard Output:', stdout);

        if (stderr) {
            console.error('Error Output:', stderr);
        }
        
        if (!fs.existsSync(outputFile)) {
            return new AnalysisResult(null);
        }

        const jsonData = readFileSync(outputFile, 'utf-8');
        return new AnalysisResult(jsonData);
    }
}