$baseDir = "c:\Users\akash\Downloads\techeminance-updated\techeminance"

# 1. robots.txt
$robots = @"
User-agent: *
Allow: /

Sitemap: https://techeminance.com/sitemap.xml
"@
[System.IO.File]::WriteAllText("$baseDir\robots.txt", $robots)

# 2. sitemap.xml
$date = Get-Date -Format "yyyy-MM-dd"
$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://techeminance.com/</loc><lastmod>$date</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://techeminance.com/about</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://techeminance.com/services</loc><lastmod>$date</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://techeminance.com/services/web-design-development</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://techeminance.com/portfolio</loc><lastmod>$date</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://techeminance.com/blog</loc><lastmod>$date</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://techeminance.com/blog/12-elements-business-website-needs</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/add-new-web-service-without-hiring</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/ai-search-changing-seo</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/how-typography-shapes-first-impressions</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/shopify-seo-growing-stores</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/shopify-vs-woocommerce-2025</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/website-contract-checklist</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/wordpress-care-plan-cost</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/blog/when-to-hire-in-house-vs-outsource</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://techeminance.com/contact</loc><lastmod>$date</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://techeminance.com/privacy-policy</loc><lastmod>$date</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://techeminance.com/terms</loc><lastmod>$date</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
"@
[System.IO.File]::WriteAllText("$baseDir\sitemap.xml", $sitemap)

# 3. manifest.webmanifest
$manifest = @"
{
  "name": "Tech Eminence",
  "short_name": "Tech Eminence",
  "description": "Expert Web Design, Shopify, and WordPress Development.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0c0c0c",
  "theme_color": "#e8520a",
  "icons": [
    {
      "src": "/assets/images/logo-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/images/logo-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
"@
[System.IO.File]::WriteAllText("$baseDir\manifest.webmanifest", $manifest)

# 4. browserconfig.xml
$browserconfig = @"
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/assets/images/logo-150x150.png"/>
      <TileColor>#e8520a</TileColor>
    </tile>
  </msapplication>
</browserconfig>
"@
[System.IO.File]::WriteAllText("$baseDir\browserconfig.xml", $browserconfig)

# 5. humans.txt
$humans = @"
/* TEAM */
  Developer: Akash
  Site: techeminance.com

/* SITE */
  Last update: $date
  Standards: HTML5, CSS3
  Components: Vanilla JS
  Software: VS Code
"@
[System.IO.File]::WriteAllText("$baseDir\humans.txt", $humans)

# 6. Basic empty pages for privacy-policy, terms, sitemap
$contactHtml = [System.IO.File]::ReadAllText("$baseDir\contact.html")
# Replace main content to make a stub
$stubHtml = $contactHtml -replace '<section class="contact-page[\s\S]*?</section>', '<section style="padding: 12rem 0 6rem; text-align: center;"><div class="container"><h1>Page under construction</h1><p>This content is coming soon.</p></div></section>'
$stubHtml = $stubHtml -replace '<title>Contact.*?<\/title>', '<title>Legal - Tech Eminence</title>'
[System.IO.File]::WriteAllText("$baseDir\privacy-policy.html", $stubHtml)
[System.IO.File]::WriteAllText("$baseDir\terms.html", $stubHtml)
[System.IO.File]::WriteAllText("$baseDir\sitemap.html", $stubHtml)

Write-Output "SEO files created."
