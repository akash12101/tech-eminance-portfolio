/**
 * Tech Eminence - Blog Details JS
 * Premium features for the blog article page
 */

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    initDynamicTOC();
    initShareButtons();
    initFormValidation();
});

/**
 * 1. Reading Progress Bar
 */
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * 2. Dynamic Table of Contents (TOC)
 */
function initDynamicTOC() {
    const tocContainer = document.getElementById('dynamicTOC');
    const articleBody = document.querySelector('.prose');
    
    if (!tocContainer || !articleBody) return;

    const headings = articleBody.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        tocContainer.parentElement.style.display = 'none';
        return;
    }

    const ul = document.createElement('ul');
    const headingElements = [];

    headings.forEach((heading, index) => {
        // Generate ID if missing
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.href = '#' + heading.id;
        a.textContent = heading.textContent;
        
        if (heading.tagName.toLowerCase() === 'h3') {
            a.className = 'toc-h3';
        }
        
        li.appendChild(a);
        ul.appendChild(li);
        
        headingElements.push({ id: heading.id, link: a });
        
        // Smooth scroll implementation
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(heading.id);
            if (target) {
                // Adjusting for fixed header
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    tocContainer.appendChild(ul);

    // Intersection Observer for highlighting active TOC section
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        // Find the currently intersecting heading or the closest one above
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active from all
                headingElements.forEach(item => item.link.classList.remove('is-active'));
                
                // Add to current
                const currentLink = headingElements.find(item => item.id === entry.target.id);
                if (currentLink) {
                    currentLink.link.classList.add('is-active');
                }
            }
        });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));
}

/**
 * 3. Share & Copy Link Buttons
 */
function initShareButtons() {
    const copyBtn = document.getElementById('copyLinkBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.location.href;
            
            navigator.clipboard.writeText(url).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.style.background = '#22965a';
                copyBtn.style.color = '#fff';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.background = '';
                    copyBtn.style.color = '';
                }, 2000);
            });
        });
    }

    // Initialize simple popups for share links
    const shareLinks = document.querySelectorAll('.share-btn:not(.share-btn--copy)');
    shareLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.href;
            if (url && url !== '#' && !url.includes('javascript:')) {
                window.open(url, 'share-window', 'width=600,height=400');
            }
        });
    });
}

/**
 * 4. Basic Form Validation (Newsletter & Comments)
 */
function initFormValidation() {
    // Newsletter Form
    const newsletterForm = document.getElementById('sidebarNewsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            const btn = newsletterForm.querySelector('button');
            
            if (input.value && input.value.includes('@')) {
                const originalText = btn.textContent;
                btn.textContent = 'Subscribed ✓';
                btn.style.background = '#22965a';
                input.value = '';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // Comment Form
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = commentForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Submitting...';
            btn.disabled = true;
            
            // Simulate submission
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Submitted';
                btn.style.background = '#22965a';
                btn.style.borderColor = '#22965a';
                
                commentForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.disabled = false;
                }, 3000);
            }, 1000);
        });
    }
}
