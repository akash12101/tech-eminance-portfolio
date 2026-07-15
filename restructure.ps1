$baseDir = "c:\Users\akash\Downloads\techeminance-updated\techeminance"

# 1. Create directories
$dirs = @("assets\css", "assets\js", "blog", "services", "portfolio")
foreach ($dir in $dirs) {
    if (-not (Test-Path "$baseDir\$dir")) {
        New-Item -ItemType Directory -Path "$baseDir\$dir" | Out-Null
    }
}

# 2. Move CSS and JS
if (Test-Path "$baseDir\css") {
    Move-Item -Path "$baseDir\css\*" -Destination "$baseDir\assets\css\" -Force
    Remove-Item -Path "$baseDir\css" -Recurse -Force
}
if (Test-Path "$baseDir\js") {
    Move-Item -Path "$baseDir\js\*" -Destination "$baseDir\assets\js\" -Force
    Remove-Item -Path "$baseDir\js" -Recurse -Force
}

# 3. Move Blog Files
$blogFiles = @(
    "12-elements-business-website-needs.html",
    "add-new-web-service-without-hiring.html",
    "ai-search-changing-seo.html",
    "how-typography-shapes-first-impressions.html",
    "shopify-seo-growing-stores.html",
    "shopify-vs-woocommerce-2025.html",
    "website-contract-checklist.html",
    "wordpress-care-plan-cost.html",
    "blog-detail.html"
)
foreach ($file in $blogFiles) {
    if (Test-Path "$baseDir\$file") {
        if ($file -eq "blog-detail.html") {
            Move-Item -Path "$baseDir\$file" -Destination "$baseDir\blog\when-to-hire-in-house-vs-outsource.html" -Force
        } else {
            Move-Item -Path "$baseDir\$file" -Destination "$baseDir\blog\$file" -Force
        }
    }
}
if (Test-Path "$baseDir\blog-details.html") { Remove-Item "$baseDir\blog-details.html" -Force } # remove old unused file

# 4. Move Service Files
if (Test-Path "$baseDir\web-design-development.html") {
    Move-Item -Path "$baseDir\web-design-development.html" -Destination "$baseDir\services\web-design-development.html" -Force
}

Write-Output "File movement completed."
