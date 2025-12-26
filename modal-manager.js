/**
 * Modal Manager Module
 * Quản lý popup modal
 */
const ModalManager = {
    /**
     * Initialize modal events
     */
    init() {
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }
    },
    
    /**
     * Show modal
     */
    showModal() {
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.classList.add('show');
        }
    },
    
    /**
     * Hide modal
     */
    hideModal() {
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.classList.remove('show');
        }
    },
    
    /**
     * Update modal content
     * @param {Object} content - {emoji, message, score, percentage}
     */
    updateContent(content) {
        const { emoji, message, score, percentage } = content;
        
        const emojiEl = document.getElementById('resultEmoji');
        const messageEl = document.getElementById('resultMessage');
        const scoreEl = document.getElementById('resultScore');
        const percentageEl = document.getElementById('resultPercentage');
        
        if (emojiEl && emoji) emojiEl.textContent = emoji;
        if (messageEl && message) messageEl.textContent = message;
        if (scoreEl && score) scoreEl.textContent = score;
        if (percentageEl && percentage) percentageEl.textContent = percentage;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
}