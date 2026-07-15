$root = 'c:\Users\akash\Downloads\techeminance-updated\techeminance'
Set-Location $root
$htmlFiles = Get-ChildItem -Recurse -Filter *.html
$issues = New-Object System.Collections.Generic.List[object]

function Resolve-PathSafe([string]$basePath, [string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return $null }
  if ($value.StartsWith('http://') -or $value.StartsWith('https://') -or $value.StartsWith('mailto:') -or $value.StartsWith('tel:') -or $value.StartsWith('javascript:') -or $value.StartsWith('#') -or $value.StartsWith('data:')) { return $null }
  $path = $value.Split('#')[0].Split('?')[0]
  if ([string]::IsNullOrWhiteSpace($path)) { return $null }
  if ($path.StartsWith('/')) {
    return Join-Path $root ($path.TrimStart('/'))
  }
  return Join-Path $basePath $path
}

foreach ($file in $htmlFiles) {
  $text = Get-Content -Path $file.FullName -Raw
  foreach ($m in [regex]::Matches($text, '(?:href|src)=["'']([^"'']+)["'']')) {
    $val = $m.Groups[1].Value.Trim()
    $candidate = Resolve-PathSafe $file.DirectoryName $val
    if (-not $candidate) { continue }
    if (-not (Test-Path -LiteralPath $candidate)) {
      $issues.Add([pscustomobject]@{ File = $file.FullName; Reference = $val; Candidate = $candidate })
    }
  }
  foreach ($m in [regex]::Matches($text, 'rel="stylesheet"[^>]*href=["'']([^"'']+)["'']')) {
    $val = $m.Groups[1].Value.Trim()
    $candidate = Resolve-PathSafe $file.DirectoryName $val
    if (-not $candidate) { continue }
    if (-not (Test-Path -LiteralPath $candidate)) {
      $issues.Add([pscustomobject]@{ File = $file.FullName; Reference = $val; Candidate = $candidate; Kind = 'stylesheet' })
    }
  }
  foreach ($m in [regex]::Matches($text, '<script[^>]*src=["'']([^"'']+)["'']')) {
    $val = $m.Groups[1].Value.Trim()
    $candidate = Resolve-PathSafe $file.DirectoryName $val
    if (-not $candidate) { continue }
    if (-not (Test-Path -LiteralPath $candidate)) {
      $issues.Add([pscustomobject]@{ File = $file.FullName; Reference = $val; Candidate = $candidate; Kind = 'script' })
    }
  }
}

Write-Host "HTML files scanned: $($htmlFiles.Count)"
Write-Host "Remaining broken references: $($issues.Count)"
if ($issues.Count -gt 0) {
  $issues | Select-Object -First 200 | Format-Table -AutoSize
}
