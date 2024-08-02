Clear-Host
cd C:\MyGit\Personal\ReSharperRunner\ReSharperRunnerTask
Remove-Item C:\MyGit\Personal\ReSharperRunner\ReSharperRunnerTask\dist -Recurse -Force
tsc
cd dist
node index.js