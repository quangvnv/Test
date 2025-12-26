/**
 * Scroll Controller Module
 * Điều khiển scroll của trang
 */
const ScrollController = {
    /**
     * Scroll to top of page
     * @param {boolean} smooth - Use smooth scroll (default: true)
     */
    scrollToTop(smooth = true) {
        window.scrollTo({ 
            top: 0, 
            behavior: smooth ? 'smooth' : 'auto' 
        });
    },
    
    /**
     * Scroll to element by ID
     * @param {string} elementId - ID of element to scroll to
     * @param {boolean} smooth - Use smooth scroll (default: true)
     */
    scrollToElement(elementId, smooth = true) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ 
                behavior: smooth ? 'smooth' : 'auto',
                block: 'start'
            });
        }
    },
    
    /**
     * Setup scroll to top button
     */
    setupScrollButton() {
        const topBtn = document.querySelector('.top-btn');
        if (topBtn) {
            topBtn.addEventListener('click', () => {
                this.scrollToTop();
            });
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollController;
}