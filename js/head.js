/* ==========================================================================
   Inject header / footer cells
   ========================================================================== */
const ARTICLE_META = {
  'station-categorisation-1.html': {
    author: 'Diego Perez-Alvarez',
    date: 'Aug 21, 2026',
    isoDate: '2026-08-21'
  }
};

function getMetadataForCurrentPage() {
  const filename = window.location.pathname.split('/').pop();
  return ARTICLE_META[filename] || { author: 'Anonymous', date: '', isoDate: '' };
}

function injectCells() {
	// Do not rerun
	if (document.getElementById('cell-header-injection')) return true;
	
	// Check required elements exist
	const appContainer = document.getElementById('App');
	if (!appContainer) return false;

	const flexContainer = appContainer.querySelector('.flex.flex-col');
	if (!flexContainer) return false;

	const spacer = appContainer.querySelector('.sm\\:pt-8');
	if (!spacer) return false;
	
	spacer.remove();

	// Create the elements as child of 'App'
	const customHeader = document.createElement('div');
	customHeader.id = 'cell-header-injection';
	customHeader.innerHTML = `
	  <header id="app-header">
		<span><a href="../" class="site-tagline">&larr;home</a></span>
	  </header>
	`;

	const meta = getMetadataForCurrentPage();
	const customFooter = document.createElement('div');
	customFooter.id = 'app-footer';
	customFooter.innerHTML = `
    <div class="footer-content">
      <span class="footer-author"><strong>${meta.author}</strong></span>
      <span class="footer-separator">&bull;</span>
      <time class="footer-date" datetime="${meta.isoDate}">${meta.date}</time>
    </div>
  `;
	
	flexContainer.prepend(customHeader);
	flexContainer.append(customFooter);
	return true;
}


function initInjectCells() {
  // Try immediately in case DOM is already hydrated
  if (injectCells()) return;

  // Set up observer on body to watch for marimo rendering nodes
  const observer = new MutationObserver((mutations, obs) => {
	if (injectCells()) {
	  // Once successfully injected, stop observing to conserve memory
	  obs.disconnect();
	}
  });

  // Watch for changes across the entire subtree
  observer.observe(document.body, {
	childList: true,
	subtree: true,
  });
}


// Run observer startup after initial DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInjectCells);
} else {
  initInjectCells();
}