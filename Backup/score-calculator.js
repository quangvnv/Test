/**
 * Score Calculator Module
 * Tính điểm và hiển thị kết quả
 */
const ScoreCalculator = {
    /**
     * Calculate percentage
     * @param {number} score - Number of correct answers
     * @param {number} total - Total number of questions
     * @returns {number} - Percentage (rounded)
     */
    calculatePercentage(score, total) {
        return Math.round((score / total) * 100);
    },
    
    /**
     * Get emoji and message based on percentage
     * @param {number} percentage - Score percentage
     * @returns {Object} - {emoji, message}
     */
    getResultEmoji(percentage) {
        if (percentage < 50) {
            return {
                emoji: '📚',
                message: 'Cố gắng lên!'
            };
        } else if (percentage < 80) {
            return {
                emoji: '👍',
                message: 'Khá tốt!'
            };
        } else {
            return {
                emoji: '🎉',
                message: 'Xuất sắc!'
            };
        }
    },
    
    /**
     * Display result in modal
     * @param {number} score - Number of correct answers
     * @param {number} total - Total number of questions
     */
    displayResult(score, total) {
        const percentage = this.calculatePercentage(score, total);
        const result = this.getResultEmoji(percentage);
        
        // Update modal content
        const emojiEl = document.getElementById('resultEmoji');
        const messageEl = document.getElementById('resultMessage');
        const scoreEl = document.getElementById('resultScore');
        const percentageEl = document.getElementById('resultPercentage');
        
        if (emojiEl) emojiEl.textContent = result.emoji;
        if (messageEl) messageEl.textContent = result.message;
        if (scoreEl) scoreEl.textContent = `${score}/${total}`;
        if (percentageEl) percentageEl.textContent = `Điểm số: ${percentage}%`;
        
        // Show modal
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.classList.add('show');
        }
    },
    
    /**
     * Hide result modal
     */
    hideResultModal() {
        const modal = document.getElementById('resultModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreCalculator;
}