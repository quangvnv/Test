/**
 * Font Controller Module
 * Điều khiển kích thước font chữ (Section1 settings)
 */
const FontController = {
    fontSize: 25, // Default for question number
    optionFontSize: 25, // Default for options
    explanationFontSize: 25, // Default for explanations
    
    /**
     * Initialize with custom font sizes
     * @param {Object} sizes - {fontSize, optionFontSize, explanationFontSize}
     */
    init(sizes = {}) {
        this.fontSize = sizes.fontSize || 25;
        this.optionFontSize = sizes.optionFontSize || 25;
        this.explanationFontSize = sizes.explanationFontSize || 25;
    },
    
    /**
     * Change font size
     * @param {number} delta - Amount to change (+1 or -1)
     */
    changeFontSize(delta) {
        this.fontSize += delta;
        this.optionFontSize += delta;
        this.explanationFontSize += delta;
        
        this.applyFontSize();
    },
    
    /**
     * Apply current font sizes to elements
     */
    applyFontSize() {
        // Apply to question numbers
        document.querySelectorAll('.question-number').forEach(el => {
            el.style.fontSize = this.fontSize + 'px';
        });
        
        // Apply to question text (for text-based questions)
        document.querySelectorAll('.question-text').forEach(el => {
            el.style.fontSize = (this.fontSize - 2) + 'px'; // Slightly smaller than number
        });
        
        // Apply to options
        document.querySelectorAll('.option-label').forEach(el => {
            el.style.fontSize = this.optionFontSize + 'px';
        });
        
        // Apply to explanations
        document.querySelectorAll('.explanation-text').forEach(el => {
            el.style.fontSize = this.explanationFontSize + 'px';
        });
        
        document.querySelectorAll('.explanation-title').forEach(el => {
            el.style.fontSize = this.explanationFontSize + 'px';
        });
    },
    
    /**
     * Setup font control buttons
     */
    setupControls() {
        const increaseBtn = document.querySelector('.font-controls button:first-child');
        const decreaseBtn = document.querySelector('.font-controls button:last-child');
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => this.changeFontSize(1));
        }
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => this.changeFontSize(-1));
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FontController;
}