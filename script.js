document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const menuLinks = document.querySelectorAll('.fixed-menu a');
    const defaultPage = 'pages/home.html'; // Page to load by default

    // Function to load content
    async function loadContent(pageUrl) {
        try {
            // Add a loading state (optional)
            mainContent.innerHTML = '<p>Loading content...</p>';
            
            const response = await fetch(pageUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            mainContent.innerHTML = content;
        } catch (error) {
            mainContent.innerHTML = `<p>Sorry, could not load the page. Error: ${error.message}</p>`;
            console.error('Failed to load page:', error);
        }
    }

    // Function to handle link clicks
    function handleMenuClick(event) {
        event.preventDefault(); // Prevent default link navigation
        const pageFile = event.target.getAttribute('data-page');
        const pageUrl = `pages/${pageFile}`;
        
        if (pageFile) {
            loadContent(pageUrl);

            // Update URL hash
            window.location.hash = event.target.hash;

            // Update active class on menu
            menuLinks.forEach(link => link.classList.remove('active'));
            event.target.classList.add('active');
        }
    }

    // Add click event listeners to all menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', handleMenuClick);
    });

    // Load initial content based on hash or default
    function loadInitialPage() {
        let initialPageFile;
        if (window.location.hash) {
            const hash = window.location.hash.substring(1); // Remove #
            // Find the corresponding link to get the data-page attribute
            const activeLink = document.querySelector(`.fixed-menu a[href="#${hash}"]`);
            if (activeLink) {
                initialPageFile = activeLink.getAttribute('data-page');
                menuLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }
        }
        
        if (initialPageFile) {
            loadContent(`pages/${initialPageFile}`);
        } else {
            // Load default page and set its link as active
            loadContent(defaultPage);
            const homeLink = document.querySelector(`.fixed-menu a[data-page="${defaultPage.replace('pages/','')}"`);
            if (homeLink) {
                homeLink.classList.add('active');
                window.location.hash = homeLink.hash || '#home'; // Update hash for default if not already set
            }
        }
    }

    // Handle back/forward navigation
    window.addEventListener('popstate', loadInitialPage);

    // Load the initial page
    loadInitialPage();
});