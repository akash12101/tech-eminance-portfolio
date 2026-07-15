$baseDir = "c:\Users\akash\Downloads\techeminance-updated\techeminance"
$htmlFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $fileName = $file.Name
    $relativePath = $file.FullName.Replace($baseDir, "").Replace("\", "/")
    if ($relativePath -eq "/index.html") { $urlPath = "/" }
    elseif ($relativePath.EndsWith(".html")) { $urlPath = $relativePath.Replace(".html", "") }
    else { $urlPath = $relativePath }
    
    $fullUrl = "https://techeminance.com$urlPath"
    
    # 1. Update <html> tag
    $content = $content -replace '<html(.*?)>', '<html$1 lang="en">'
    # Remove duplicate lang="en" if it happened
    $content = $content -replace 'lang="en" lang="en"', 'lang="en"'
    
    # 2. Extract Title and Description
    $titleMatch = [regex]::Match($content, '<title>(.*?)</title>', 'IgnoreCase')
    $title = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { "Tech Eminence" }
    
    $descMatch = [regex]::Match($content, '<meta name="description" content="(.*?)".*?>', 'IgnoreCase')
    $description = if ($descMatch.Success) { $descMatch.Groups[1].Value } else { "Expert Web Design, Shopify, and WordPress Development." }
    
    # 3. Create Meta Tags block
    $metaTags = @"
    <link rel="canonical" href="$fullUrl" />
    <meta property="og:title" content="$title" />
    <meta property="og:description" content="$description" />
    <meta property="og:url" content="$fullUrl" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://techeminance.com/assets/images/og-image.jpg" />
    <meta property="og:site_name" content="Tech Eminence" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="$title" />
    <meta name="twitter:description" content="$description" />
    <meta name="twitter:image" content="https://techeminance.com/assets/images/twitter-image.jpg" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="Tech Eminence" />
    <meta name="publisher" content="Tech Eminence" />
    <meta name="application-name" content="Tech Eminence" />
    <meta name="theme-color" content="#e8520a" />
"@

    # 4. Create JSON-LD block
    if ($relativePath -match "/blog/") {
        $schemaType = "Article"
        $schema = @"
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "$title",
      "description": "$description",
      "url": "$fullUrl",
      "author": { "@type": "Person", "name": "Akash" },
      "publisher": { "@type": "Organization", "name": "Tech Eminence", "logo": { "@type": "ImageObject", "url": "https://techeminance.com/assets/images/logo.png" } }
    }
    </script>
"@
    } elseif ($relativePath -match "/services/") {
        $schemaType = "Service"
        $schema = @"
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "$title",
      "description": "$description",
      "provider": { "@type": "Organization", "name": "Tech Eminence" },
      "url": "$fullUrl"
    }
    </script>
"@
    } elseif ($relativePath -eq "/") {
        $schemaType = "Organization"
        $schema = @"
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Tech Eminence",
      "url": "https://techeminance.com",
      "logo": "https://techeminance.com/assets/images/logo.png",
      "contactPoint": { "@type": "ContactPoint", "contactType": "customer support" }
    }
    </script>
"@
    } else {
        $schemaType = "WebPage"
        $schema = @"
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "$title",
      "description": "$description",
      "url": "$fullUrl",
      "publisher": { "@type": "Organization", "name": "Tech Eminence" }
    }
    </script>
"@
    }

    # Inject Meta Tags and JSON-LD before </head>
    # First, try to remove existing canonical, og:, twitter: tags to avoid duplicates
    $content = $content -replace '(?i)<link[^>]*rel="canonical"[^>]*>', ''
    $content = $content -replace '(?i)<meta[^>]*property="og:[^>]*>', ''
    $content = $content -replace '(?i)<meta[^>]*name="twitter:[^>]*>', ''
    
    $injection = "`n" + $metaTags + "`n" + $schema + "`n</head>"
    $content = $content -replace '(?i)</head>', $injection
    
    # 5. Image optimizations (lazy loading)
    # Add loading="lazy" decoding="async" to img tags if they don't have it
    $content = [regex]::Replace($content, '(?i)<img((?!loading=)[^>])+>', {
        param($m)
        $tag = $m.Value
        if ($tag -notmatch 'loading=') {
            $tag = $tag -replace '<img', '<img loading="lazy" decoding="async"'
        }
        return $tag
    })

    [System.IO.File]::WriteAllText($file.FullName, $content)
}

Write-Output "SEO and Performance optimizations applied."
