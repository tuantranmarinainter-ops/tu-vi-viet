$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
$runtimeDirectory = Join-Path $projectRoot 'work/runtime'
New-Item -ItemType Directory -Force -Path $runtimeDirectory | Out-Null
$index = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json'
$release = $index | Where-Object { $_.version -like 'v22.*' -and $_.lts } | Select-Object -First 1
if (-not $release) { throw 'No supported Node 22 LTS release found.' }
$archive = 'node-' + $release.version + '-win-x64.zip'
$releaseUrl = 'https://nodejs.org/dist/' + $release.version + '/'
$archivePath = Join-Path $runtimeDirectory $archive
Invoke-WebRequest -Uri ($releaseUrl + $archive) -OutFile $archivePath
$sums = (Invoke-WebRequest -Uri ($releaseUrl + 'SHASUMS256.txt')).Content
$expected = (($sums -split "`n" | Where-Object { $_ -match ([regex]::Escape($archive) + '$') }) -split '\s+')[0]
if (-not $expected -or (Get-FileHash -Algorithm SHA256 -LiteralPath $archivePath).Hash -ne $expected) { throw 'Node checksum mismatch; archive was not executed.' }
Expand-Archive -LiteralPath $archivePath -DestinationPath $runtimeDirectory -Force
Write-Output ('Verified portable Node ' + $release.version + '. No system Node was replaced.')
