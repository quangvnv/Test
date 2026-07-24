/**
 * Retry Handler Module
 * Xử lý chức năng làm lại bài test
 */
const RetryHandler = {
    /**
     * Setup retry button
     * @param {Function} retryCallback - Callback khi nhấn retry
     */
    setupRetryButton(retryCallback) {
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                retryCallback();
            });
        }
    },
    
    /**
     * Show retry button
     */
    showRetryButton() {
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.classList.add('show');
        }
    },
    
    /**
     * Hide retry button
     */
    hideRetryButton() {
        const retryBtn = document.getElementById('retryBtn');
        if (retryBtn) {
            retryBtn.classList.remove('show');
        }
    },
    
    /**
     * Show submit button
     */
    showSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.style.display = 'inline-block';
        }
    },
    
    /**
     * Hide submit button
     */
    hideSubmitButton() {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.style.display = 'none';
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RetryHandler;
}