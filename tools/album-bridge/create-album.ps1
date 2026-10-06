param(
  [Parameter(Mandatory = $true)]
  [string]$PlanFile
)

$ErrorActionPreference = "Stop"

function Get-CorelApp {
  $progIds = @("CorelDRAW.Application.27", "CorelDRAW.Application")
  foreach ($progId in $progIds) {
    try {
      return New-Object -ComObject $progId
    } catch {}
  }
  throw "CorelDRAW 2026 COM automation is not available."
}

$plan = Get-Content -LiteralPath $PlanFile -Raw -Encoding UTF8 | ConvertFrom-Json
$app = Get-CorelApp
$app.Visible = $true

$doc = $app.CreateDocument()
$doc.Unit = 3
$doc.ReferencePoint = 9
$doc.ActivePage.SetSize(600, 300)

function Add-PhotoToFrame($doc, $frame, $photoPath) {
  $doc.ActiveLayer.Import($photoPath)
  $photo = $doc.ActiveSelection

  if ($null -eq $photo) {
    throw "CorelDRAW did not return the imported photo: $photoPath"
  }

  $fw = [double]$frame.SizeWidth
  $fh = [double]$frame.SizeHeight
  $cx = [double]$frame.PositionX
  $cy = [double]$frame.PositionY

  $iw = [double]$photo.SizeWidth
  $ih = [double]$photo.SizeHeight

  if ($iw -le 0 -or $ih -le 0) {
    throw "Invalid imported photo dimensions: $photoPath"
  }

  $frameRatio = $fw / $fh
  $photoRatio = $iw / $ih

  if ($photoRatio -gt $frameRatio) {
    $photo.SetSize(0, $fh)
  } else {
    $photo.SetSize($fw, 0)
  }

  $doc.ReferencePoint = 9
  $photo.SetPosition($cx, $cy)
  $photo.AddToPowerClip($frame)
}

$spreadIndex = 0

foreach ($spread in $plan.spreads) {
  if ($spreadIndex -gt 0) {
    $doc.AddPages(1)
  }

  $page = $doc.Pages.Item($spreadIndex + 1)
  $page.Activate()
  $page.SetSize(600, 300)

  foreach ($slot in $spread.slots) {
    $x = [double]$slot.x
    $y = [double]$slot.y
    $w = [double]$slot.w
    $h = [double]$slot.h

    $frame = $doc.ActiveLayer.CreateRectangle2($x, $y, $w, $h)
    $frame.Fill.ApplyNoFill()
    $frame.Outline.SetNoOutline()

    $photoPath = [string]$slot.photoPath
    if ([string]::IsNullOrWhiteSpace($photoPath) -or -not (Test-Path -LiteralPath $photoPath)) {
      throw "Photo not found: $photoPath"
    }

    Add-PhotoToFrame $doc $frame $photoPath
  }

  $spreadIndex++
}

$out = [string]$plan.output
if ([string]::IsNullOrWhiteSpace($out)) {
  $out = Join-Path $env:USERPROFILE "Desktop\Wedding_Album_AI.cdr"
}

$doc.SaveAs($out)
$doc.Activate()

Write-Output ("CREATED:" + $out)
