$ErrorActionPreference = "Stop"
$pgBin = "C:\Program Files\PostgreSQL\16\bin"
$root = Split-Path -Parent $PSScriptRoot
$dataDir = Join-Path $root "prisma\pgdata"

if (-not (Test-Path $dataDir)) {
  & "$pgBin\initdb.exe" -D $dataDir -U dtap -A trust --locale=C --encoding=UTF8 | Out-Null
}

Push-Location $dataDir
try {
  $status = & "$pgBin\pg_ctl.exe" -D . status 2>&1
  if ($LASTEXITCODE -ne 0) {
    & "$pgBin\pg_ctl.exe" -D . -l pg.log -o "-p 5433" start
  } else {
    Write-Host $status
  }
} finally {
  Pop-Location
}

$dbExists = & "$pgBin\psql.exe" -h 127.0.0.1 -p 5433 -U dtap -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='dtap'"
if ($dbExists -ne "1") {
  & "$pgBin\createdb.exe" -h 127.0.0.1 -p 5433 -U dtap dtap
}

Write-Host "PostgreSQL ready on 127.0.0.1:5433 (db=dtap, user=dtap)"
