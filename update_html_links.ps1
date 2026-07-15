$baseDir = "c:\Users\akash\Downloads\techeminance-updated\techeminance"
$htmlFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    # Update Asset Paths
    $content = $content -replace 'href="css/', 'href="/assets/css/'
    $content = $content -replace 'src="js/', 'src="/assets/js/'
    $content = $content -replace 'src="assets/images/', 'src="/assets/images/'
    $content = $content -replace 'href="assets/images/', 'href="/assets/images/'
    
    # Update Page Links
    $content = $content -replace 'href="index.html"', 'href="/"'
    $content = $content -replace 'href="about.html"', 'href="/about"'
    $content = $content -replace 'href="services.html"', 'href="/services"'
    $content = $content -replace 'href="how-we-work.html"', 'href="/how-we-work"'
    $content = $content -replace 'href="blog.html"', 'href="/blog"'
    $content = $content -replace 'href="contact.html"', 'href="/contact"'
    $content = $content -replace 'href="web-design-development.html"', 'href="/services/web-design-development"'
    
    # Update Blog Links
    $content = $content -replace 'href="12-elements-business-website-needs.html"', 'href="/blog/12-elements-business-website-needs"'
    $content = $content -replace 'href="add-new-web-service-without-hiring.html"', 'href="/blog/add-new-web-service-without-hiring"'
    $content = $content -replace 'href="ai-search-changing-seo.html"', 'href="/blog/ai-search-changing-seo"'
    $content = $content -replace 'href="how-typography-shapes-first-impressions.html"', 'href="/blog/how-typography-shapes-first-impressions"'
    $content = $content -replace 'href="shopify-seo-growing-stores.html"', 'href="/blog/shopify-seo-growing-stores"'
    $content = $content -replace 'href="shopify-vs-woocommerce-2025.html"', 'href="/blog/shopify-vs-woocommerce-2025"'
    $content = $content -replace 'href="website-contract-checklist.html"', 'href="/blog/website-contract-checklist"'
    $content = $content -replace 'href="wordpress-care-plan-cost.html"', 'href="/blog/wordpress-care-plan-cost"'
    $content = $content -replace 'href="blog-detail.html"', 'href="/blog/when-to-hire-in-house-vs-outsource"'
    
    # Fix any double slashes that might have occurred if a file already had absolute paths
    $content = $content -replace 'href="//assets', 'href="/assets'
    $content = $content -replace 'src="//assets', 'src="/assets'
    
    [System.IO.File]::WriteAllText($file.FullName, $content)
}

Write-Output "Links updated in all HTML files."
