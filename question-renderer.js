/**
 * Question Renderer Module
 * Render câu hỏi và options
 */
const QuestionRenderer = {
    /**
     * Shuffle array
     * @param {Array} array - Mảng cần shuffle
     * @returns {Array} - Mảng đã shuffle
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Render section with questions
     * @param {number} sectionIndex - Index của section cần render
     * @param {Object} section - Section data
     * @param {Function} answerCallback - Callback khi user chọn đáp án
     * @param {Object} options - Rendering options
     */
    renderSection(sectionIndex, section, answerCallback, options = {}) {
        const {
            hasImage = false,
            hasExplanation = false
        } = options;
        
        const container = document.getElementById('sectionsContainer');
        if (!container) return;
        
        container.style.display = 'block';
        
        // Shuffle options for each question
        const shuffledQuestionsData = section.questions.map(q => {
            const optionsWithIndices = q.options.map((opt, idx) => ({
                text: opt,
                originalIndex: idx
            }));
            return this.shuffleArray(optionsWithIndices);
        });
        
        // Render based on type
        if (hasImage) {
            container.innerHTML = this.renderImageBasedQuestions(
                sectionIndex, 
                section, 
                shuffledQuestionsData, 
                answerCallback
            );
        } else {
            container.innerHTML = this.renderTextBasedQuestions(
                sectionIndex, 
                section, 
                shuffledQuestionsData, 
                answerCallback,
                hasExplanation
            );
        }
        
        // Show submit button, hide retry button
        const submitBtn = document.getElementById('submitBtn');
        const retryBtn = document.getElementById('retryBtn');
        
        if (submitBtn) submitBtn.style.display = 'inline-block';
        if (retryBtn) retryBtn.classList.remove('show');
    },
    
    /**
     * Render image-based questions (Section 1 style)
     */
    renderImageBasedQuestions(sectionIndex, section, shuffledQuestionsData, answerCallback) {
        return `
            <div class="section-container">
                ${section.questions.map((q, qIdx) => {
                    const shuffledOptions = shuffledQuestionsData[qIdx];
                    return `
                    <div class="question-item" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                        <div class="question-image" style="display: flex; align-items: center; justify-content: center; background: #fff; padding: 20px; border-radius: 6px; border: 2px solid #e0e0e0; max-height: 215px;">
                            ${q.image ? 
                                `<img src="${q.image}" alt="Question ${qIdx + 1}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;">` : 
                                `<div class="placeholder" style="color: #999; text-align: center; padding: 60px 20px;">📷<br>Image for Question ${qIdx + 1}</div>`
                            }
                        </div>
                        <div>
                            <div class="question-number">Question ${qIdx + 1}</div>
                            <div class="options-container">
                                ${shuffledOptions.map((opt, displayIdx) => `
                                    <label class="option-item" id="option-${sectionIndex}-${qIdx}-${opt.originalIndex}">
                                        <input type="radio" 
                                               name="q-${sectionIndex}-${qIdx}" 
                                               value="${opt.originalIndex}"
                                               data-section="${sectionIndex}"
                                               data-question="${qIdx}"
                                               data-option="${opt.originalIndex}">
                                        <span class="option-label">${String.fromCharCode(65 + displayIdx)}. ${opt.text}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `}).join('')}
            </div>
        `;
    },
    
    /**
     * Render text-based questions (Section 2 style)
     */
    renderTextBasedQuestions(sectionIndex, section, shuffledQuestionsData, answerCallback, hasExplanation) {
        return `
            <div class="section-container">
                ${section.questions.map((q, qIdx) => {
                    const shuffledOptions = shuffledQuestionsData[qIdx];
                    return `
                    <div class="question-item">
                        <div class="question-text" style="font-weight: 600; color: #333; margin-bottom: 15px; font-size: 16px; line-height: 1.8;">
                            <span class="question-number">${qIdx + 1}.</span> ${q.question}
                        </div>
                        <div class="options-container">
                            ${shuffledOptions.map((opt, displayIdx) => `
                                <label class="option-item" id="option-${sectionIndex}-${qIdx}-${opt.originalIndex}">
                                    <input type="radio" 
                                           name="q-${sectionIndex}-${qIdx}" 
                                           value="${opt.originalIndex}"
                                           data-section="${sectionIndex}"
                                           data-question="${qIdx}"
                                           data-option="${opt.originalIndex}">
                                    <span class="option-label">${String.fromCharCode(65 + displayIdx)}. ${opt.text}</span>
                                </label>
                            `).join('')}
                        </div>
                        ${hasExplanation && q.explanation ? `
                        <div class="explanation-section" id="explanation-${sectionIndex}-${qIdx}" style="display: none; margin-top: 15px; padding: 15px; background: #fff3e0; border-left: 4px solid #FF9800; border-radius: 6px;">
                            <div class="explanation-title" style="font-weight: 700; color: #E65100; margin-bottom: 8px; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                                <span>💡</span>
                                <span>Giải thích:</span>
                            </div>
                            <div class="explanation-text" style="color: #5D4037; font-size: 14px; line-height: 1.6;">${q.explanation}</div>
                        </div>
                        ` : ''}
                    </div>
                `}).join('')}
            </div>
        `;
    },
    
    /**
     * Handle answer selection
     * @param {number} sectionIdx - Section index
     * @param {number} questionIdx - Question index
     * @param {number} optionIdx - Selected option index
     * @param {Object} section - Section data
     */
    handleAnswer(sectionIdx, questionIdx, optionIdx, section) {
        // Update visual state
        section.questions[questionIdx].options.forEach((_, idx) => {
            const optionElem = document.getElementById(`option-${sectionIdx}-${questionIdx}-${idx}`);
            if (optionElem) {
                optionElem.classList.toggle('selected', idx === optionIdx);
            }
        });
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionRenderer;
}