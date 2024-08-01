Clear-Host
$Env:solutionPath="C:\MyGit\Kunden\Modan\Feldkalender2\Feldkalender2.sln"
cd C:\MyGit\Personal\ReSharperRunner\ReSharperRunnerTask
Remove-Item C:\MyGit\Personal\ReSharperRunner\ReSharperRunnerTask\dist -Recurse -Force
tsc
cd dist
node index.js