/**
 * Answer Validator Module
 * Kiểm tra và đánh dấu đáp án đúng/sai
 */
const AnswerValidator = {
    /**
     * Validate and mark all answers
     * @param {number} sectionIndex - Section index
     * @param {Object} section - Section data
     * @param {Object} userAnswers - User answers object
     * @param {boolean} showExplanation - Show explanation after submit
     * @returns {number} - Score (number of correct answers)
     */
    validateAndMarkAnswers(sectionIndex, section, userAnswers, showExplanation = false) {
        let score = 0;
        
        section.questions.forEach((q, qIdx) => {
            const key = `${sectionIndex}-${qIdx}`;
            const userAns = userAnswers[key];
            const isCorrect = userAns === q.answer;
            
            if (isCorrect) score++;
            
            // Mark each option
            q.options.forEach((_, optIdx) => {
                const optionElem = document.getElementById(`option-${sectionIndex}-${qIdx}-${optIdx}`);
                const radioInput = optionElem ? optionElem.querySelector('input[type="radio"]') : null;
                
                if (optionElem && radioInput) {
                    // Disable input
                    radioInput.disabled = true;
                    optionElem.style.cursor = 'not-allowed';
                    
                    // Mark correct answer
                    if (optIdx === q.answer) {
                        optionElem.classList.add('correct');
                        optionElem.classList.remove('selected', 'incorrect');
                    } 
                    // Mark incorrect user answer
                    else if (optIdx === userAns && !isCorrect) {
                        optionElem.classList.add('incorrect');
                        optionElem.classList.remove('selected', 'correct');
                    } 
                    // Remove selected state from other options
                    else {
                        optionElem.classList.remove('selected');
                    }
                }
            });
            
            // Show explanation if available
            if (showExplanation) {
                const explanationElem = document.getElementById(`explanation-${sectionIndex}-${qIdx}`);
                if (explanationElem) {
                    explanationElem.style.display = 'block';
                    explanationElem.classList.add('show');
                }
            }
        });
        
        return score;
    },
    
    /**
     * Check if all questions are answered
     * @param {number} totalQuestions - Total number of questions
     * @param {Object} userAnswers - User answers object
     * @param {number} sectionIndex - Section index
     * @returns {boolean} - True if all answered
     */
    checkAllAnswered(totalQuestions, userAnswers, sectionIndex) {
        let answeredCount = 0;
        for (let i = 0; i < totalQuestions; i++) {
            const key = `${sectionIndex}-${i}`;
            if (userAnswers[key] !== undefined) answeredCount++;
        }
        return answeredCount === totalQuestions;
    },
    
    /**
     * Show alert for incomplete answers
     */
    showIncompleteAlert() {
        alert('Vui lòng trả lời tất cả các câu hỏi!');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnswerValidator;
}