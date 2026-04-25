param(
    [string]$TraefikNetwork = "webproxy",
    [string]$MailNetwork = "mail-shared-network",
    [string]$FrontendHealthUrl = "http://localhost:8082/health",
    [string]$ApiHealthUrl = "http://localhost:8080/api/health",
    [string]$NewsletterUrl = "http://localhost:8080/api/newsletter/subscribe",
    [string]$TestEmail = "",
    [switch]$AutoStartPostfix,
    [switch]$SkipComposeUp
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n[STEP] $Message" -ForegroundColor Cyan
}

function Write-Ok {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[FAIL] $Message" -ForegroundColor Red
}

function Get-ResponseBodyFromException {
    param($Exception)

    try {
        if ($null -eq $Exception.Response) {
            return ""
        }

        $stream = $Exception.Response.GetResponseStream()
        if ($null -eq $stream) {
            return ""
        }

        $reader = New-Object System.IO.StreamReader($stream)
        try {
            return $reader.ReadToEnd()
        }
        finally {
            $reader.Dispose()
            $stream.Dispose()
        }
    }
    catch {
        return ""
    }
}

function Invoke-GetCheck {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10
        return [pscustomobject]@{
            Ok     = $true
            Status = [int]$response.StatusCode
            Body   = [string]$response.Content
            Error  = ""
        }
    }
    catch {
        $status = 0
        try {
            if ($null -ne $_.Exception.Response) {
                $status = [int]$_.Exception.Response.StatusCode
            }
        }
        catch {
            $status = 0
        }

        return [pscustomobject]@{
            Ok     = $false
            Status = $status
            Body   = Get-ResponseBodyFromException -Exception $_.Exception
            Error  = $_.Exception.Message
        }
    }
}

function Invoke-PostJsonCheck {
    param(
        [string]$Url,
        [string]$JsonBody
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -Method Post -ContentType "application/json" -Body $JsonBody -UseBasicParsing -TimeoutSec 20
        return [pscustomobject]@{
            Ok     = $true
            Status = [int]$response.StatusCode
            Body   = [string]$response.Content
            Error  = ""
        }
    }
    catch {
        $status = 0
        try {
            if ($null -ne $_.Exception.Response) {
                $status = [int]$_.Exception.Response.StatusCode
            }
        }
        catch {
            $status = 0
        }

        return [pscustomobject]@{
            Ok     = $false
            Status = $status
            Body   = Get-ResponseBodyFromException -Exception $_.Exception
            Error  = $_.Exception.Message
        }
    }
}

function Ensure-DockerNetwork {
    param([string]$Name)

    $existingNames = docker network ls --format '{{.Name}}'
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to list Docker networks."
    }

    if ($existingNames -contains $Name) {
        Write-Ok "Network '$Name' already exists"
        return
    }

    docker network create $Name | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Unable to create Docker network '$Name'."
    }

    Write-Ok "Network '$Name' created"
}

function Show-ServiceLogs {
    param(
        [string]$Service,
        [int]$Tail = 40
    )

    $containerId = docker compose ps -q $Service
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($containerId)) {
        Write-Warn "No running container found for service '$Service'"
        return
    }

    Write-Host "`n----- logs: $Service -----" -ForegroundColor DarkGray
    docker logs $containerId --tail $Tail
}

function Test-ContainerRunning {
    param([string]$Name)

    $lines = docker ps --filter "name=^/$Name$" --format '{{.Names}}'
    if ($LASTEXITCODE -ne 0) {
        return $false
    }

    foreach ($line in $lines) {
        if ($line.Trim() -eq $Name) {
            return $true
        }
    }

    return $false
}

function Test-ContainerExists {
    param([string]$Name)

    $lines = docker ps -a --filter "name=^/$Name$" --format '{{.Names}}'
    if ($LASTEXITCODE -ne 0) {
        return $false
    }

    foreach ($line in $lines) {
        if ($line.Trim() -eq $Name) {
            return $true
        }
    }

    return $false
}

function Show-PostfixQueue {
    if (-not (Test-ContainerRunning -Name 'postfix')) {
        Write-Warn "postfix container not running (skipping queue check)"
        return
    }

    Write-Host "`n----- queue: postfix -----" -ForegroundColor DarkGray
    $queue = docker exec postfix postqueue -p
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Unable to read postfix queue"
        return
    }

    $queue | ForEach-Object { Write-Host $_ }

    $queueText = ($queue -join "`n")
    if ($queueText -match 'Mail queue is empty') {
        Write-Ok "postfix queue is empty"
    }
    else {
        Write-Warn "postfix queue contains pending or deferred messages"
    }
}

Write-Step "Checking Docker daemon"
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Docker daemon is not reachable. Start Docker Desktop and retry."
    exit 1
}
Write-Ok "Docker daemon is reachable"

Write-Step "Ensuring required Docker networks"
Ensure-DockerNetwork -Name $TraefikNetwork
Ensure-DockerNetwork -Name $MailNetwork

if (-not $SkipComposeUp) {
    Write-Step "Starting stack with docker compose"
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Fail "docker compose up -d failed"
        exit 1
    }
    Write-Ok "docker compose up -d completed"
}

if ($AutoStartPostfix) {
    Write-Step "Ensuring postfix container exists"
    $postfixRunning = Test-ContainerRunning -Name 'postfix'
    if ($LASTEXITCODE -ne 0 -and -not $postfixRunning) {
        Write-Warn "Unable to inspect running containers for postfix"
    }

    if (-not $postfixRunning) {
        $postfixAny = Test-ContainerExists -Name 'postfix'
        if ($LASTEXITCODE -ne 0 -and -not $postfixAny) {
            Write-Warn "Unable to inspect all containers for postfix"
        }

        if ($postfixAny) {
            docker start postfix | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Ok "Existing postfix container started"
            }
            else {
                Write-Warn "Could not start existing postfix container"
            }
        }
        else {
            docker run -d --name postfix --network $MailNetwork -p 25:25 -e ALLOWED_SENDER_DOMAINS=bellemontrewallone.store -e HOSTNAME=mail.bellemontrewallone.store boky/postfix | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Ok "postfix container created and started"
            }
            else {
                Write-Warn "Could not create postfix automatically"
            }
        }
    }
    else {
        Write-Ok "postfix is already running"
    }
}

Write-Step "Current compose services"
docker compose ps

Write-Step "Testing frontend health"
$frontendResult = Invoke-GetCheck -Url $FrontendHealthUrl
if ($frontendResult.Ok -and $frontendResult.Status -eq 200) {
    Write-Ok "Frontend health OK ($($frontendResult.Status))"
}
else {
    Write-Warn "Frontend health check failed. Status=$($frontendResult.Status). Error=$($frontendResult.Error)"
}

Write-Step "Testing API health"
$apiResult = Invoke-GetCheck -Url $ApiHealthUrl
if ($apiResult.Ok -and $apiResult.Status -eq 200) {
    Write-Ok "API health OK ($($apiResult.Status))"
    Write-Host "API body: $($apiResult.Body)"
}
else {
    Write-Fail "API health check failed. Status=$($apiResult.Status). Error=$($apiResult.Error)"
    Show-ServiceLogs -Service backend -Tail 80
    exit 1
}

if ([string]::IsNullOrWhiteSpace($TestEmail)) {
    Write-Warn "Newsletter test skipped (no -TestEmail provided)"
    Write-Host "Run again with: .\\scripts\\test-stack.ps1 -TestEmail yourmail@gmail.com -AutoStartPostfix"
}
else {
    Write-Step "Testing newsletter endpoint"
    $payload = @{ email = $TestEmail } | ConvertTo-Json -Compress
    $newsletterResult = Invoke-PostJsonCheck -Url $NewsletterUrl -JsonBody $payload

    if ($newsletterResult.Status -eq 200) {
        Write-Ok "Newsletter endpoint returned 200"
    }
    else {
        Write-Warn "Newsletter endpoint returned Status=$($newsletterResult.Status)"
    }

    if (-not [string]::IsNullOrWhiteSpace($newsletterResult.Body)) {
        Write-Host "Newsletter body: $($newsletterResult.Body)"
    }

    if (-not $newsletterResult.Ok) {
        Write-Warn "Newsletter call error: $($newsletterResult.Error)"
    }

    Write-Host "Check your inbox and spam folder for $TestEmail"
}

Write-Step "Collecting logs"
Show-ServiceLogs -Service backend -Tail 80

if (Test-ContainerRunning -Name 'postfix') {
    Write-Host "`n----- logs: postfix -----" -ForegroundColor DarkGray
    docker logs postfix --tail 80
}
else {
    Write-Warn "postfix container not running (skipping postfix logs)"
}

Show-PostfixQueue

Write-Ok "Test script completed"