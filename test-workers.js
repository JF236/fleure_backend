const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const workerDirs = fs.readdirSync('./workers').filter(dir => fs.statSync(path.join('./workers', dir)).isDirectory());

let totalTests = 0;
let totalPassed = 0;

workerDirs.forEach(dir => {
    try {
        execSync(`cd workers/${dir} && npx jest --json --outputFile=jest-results.json`, { stdio: 'pipe' });
    } catch (error) {}

    const results = JSON.parse(fs.readFileSync(path.join('workers', dir, 'jest-results.json')));
    console.log(`Testing ${dir}: ${results.numPassedTests} / ${results.numTotalTests}`);
    totalPassed += results.numPassedTests;
    totalTests += results.numTotalTests;
});

console.log();
console.log(`Test results: ${totalPassed} / ${totalTests}`);
console.log();
