/**
 * Navigation Module
 * Quản lý điều hướng giữa các test/section
 */
const Navigation = {
    /**
     * Render navigation buttons
     * @param {Array} sections - Mảng các sections
     * @param {Function} switchCallback - Callback khi switch section
     */
    renderNavigation(sections, switchCallback) {
        if (sections.length <= 1) return;
        
        const navDiv = document.getElementById('navigation');
        if (!navDiv) return;
        
        navDiv.style.display = 'flex';
        navDiv.innerHTML = sections.map((section, idx) => `
            <button class="nav-btn ${idx === 0 ? 'active' : ''}" 
                    data-index="${idx}">
                Test ${idx + 1}
            </button>
        `).join('');
        
        // Add click event listeners
        navDiv.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                switchCallback(index);
            });
        });
    },
    
    /**
     * Update active navigation button
     * @param {number} activeIndex - Index của button cần active
     */
    updateActiveButton(activeIndex) {
        document.querySelectorAll('.nav-btn').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === activeIndex);
        });
    },
    
    /**
     * Hide navigation
     */
    hideNavigation() {
        const navDiv = document.getElementById('navigation');
        if (navDiv) {
            navDiv.style.display = 'none';
        }
    },
    
    /**
     * Show navigation
     */
    showNavigation() {
        const navDiv = document.getElementById('navigation');
        if (navDiv) {
            navDiv.style.display = 'flex';
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}