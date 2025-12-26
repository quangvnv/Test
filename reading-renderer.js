/**
 * Reading Renderer Module
 * Render reading comprehension with passage and questions panels
 */
const ReadingRenderer = {
    /**
     * Shuffle array
     * @param {Array} array - Array to shuffle
     * @returns {Array} - Shuffled array
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
     * Render section with passage and questions
     * @param {number} sectionIndex - Section index
     * @param {Object} section - Section data
     * @param {Object} options - Rendering options
     */
    renderSection(sectionIndex, section, options = {}) {
        const {
            hasExplanation = true
        } = options;
        
        // Show content wrapper
        const contentWrapper = document.getElementById('contentWrapper');
        if (contentWrapper) {
            contentWrapper.style.display = 'flex';
        }
        
        // Render passage
        this.renderPassage(section);
        
        // Render questions
        this.renderQuestions(sectionIndex, section, hasExplanation);
        
        // Setup event listeners for options
        this.setupOptionListeners();
        
        // Show submit button, hide retry button
        const submitBtn = document.getElementById('submitBtn');
        const retryBtn = document.getElementById('retryBtn');
        
        if (submitBtn) submitBtn.style.display = 'inline-block';
        if (retryBtn) retryBtn.classList.remove('show');
    },
    
    /**
     * Render passage panel
     * @param {Object} section - Section data
     */
    renderPassage(section) {
        const passagePanel = document.getElementById('passagePanel');
        if (!passagePanel || !section.passage) return;
        
        const paragraphs = section.passage
            .split('\n\n')
            .map(p => `<p>${p}</p>`)
            .join('');
        
        passagePanel.innerHTML = paragraphs;
    },
    
    /**
     * Render questions panel
     * @param {number} sectionIndex - Section index
     * @param {Object} section - Section data
     * @param {boolean} hasExplanation - Show explanation after submit
     */
    renderQuestions(sectionIndex, section, hasExplanation) {
        const questionsPanel = document.getElementById('questionsPanel');
        if (!questionsPanel) return;
        
        questionsPanel.innerHTML = '';
        
        section.questions.forEach((q, qIdx) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.id = `question-${sectionIndex}-${qIdx}`;
            
            // Create array of options with original indices
            const optionsWithIndices = q.options.map((opt, optIdx) => ({
                text: opt,
                originalIndex: optIdx
            }));
            
            // Shuffle the options
            const shuffledOptions = this.shuffleArray(optionsWithIndices);
            
            const options = shuffledOptions.map((opt, displayIdx) => {
                const label = String.fromCharCode(65 + displayIdx);
                return `
                    <div class="option" 
                         id="option-${sectionIndex}-${qIdx}-${opt.originalIndex}"
                         data-section="${sectionIndex}" 
                         data-question="${qIdx}" 
                         data-answer="${opt.originalIndex}">
                        <span class="option-label">${label}.</span>
                        <span>${opt.text}</span>
                    </div>
                `;
            }).join('');
            
            questionDiv.innerHTML = `
                <div class="question-text">${qIdx + 1}. ${q.question}</div>
                <div class="options">${options}</div>
            `;
            
            questionsPanel.appendChild(questionDiv);
        });
    },
    
    /**
     * Setup option click listeners
     */
    setupOptionListeners() {
        document.querySelectorAll('.option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                this.handleOptionClick(e);
            });
        });
    },
    
    /**
     * Handle option click
     * @param {Event} e - Click event
     */
    handleOptionClick(e) {
        const option = e.currentTarget;
        const sectionIdx = option.dataset.section;
        const questionIdx = option.dataset.question;
        const answer = option.dataset.answer;
        
        // Remove selected class from all options in this question
        document.querySelectorAll(`.option[data-section="${sectionIdx}"][data-question="${questionIdx}"]`)
            .forEach(opt => {
                opt.classList.remove('selected');
            });
        
        // Add selected class to clicked option
        option.classList.add('selected');
        
        // Save answer
        StateManager.setUserAnswer(parseInt(sectionIdx), parseInt(questionIdx), parseInt(answer));
    },
    
    /**
     * Validate and mark answers
     * @param {number} sectionIndex - Section index
     * @param {Object} section - Section data
     * @param {Object} userAnswers - User answers
     * @param {boolean} showExplanation - Show explanation
     * @returns {number} - Score
     */
    validateAndMarkAnswers(sectionIndex, section, userAnswers, showExplanation = true) {
        let score = 0;
        
        section.questions.forEach((q, qIdx) => {
            const key = `${sectionIndex}-${qIdx}`;
            const userAns = userAnswers[key];
            const isCorrect = userAns === q.answer;
            
            if (isCorrect) score++;
            
            // Mark all options
            document.querySelectorAll(`.option[data-section="${sectionIndex}"][data-question="${qIdx}"]`)
                .forEach(opt => {
                    opt.style.pointerEvents = 'none';
                    opt.style.cursor = 'not-allowed';
                    
                    const optAnswer = parseInt(opt.dataset.answer);
                    
                    if (optAnswer === q.answer) {
                        opt.classList.add('correct');
                        opt.classList.remove('selected');
                    } else if (optAnswer === userAns && !isCorrect) {
                        opt.classList.add('incorrect');
                        opt.classList.remove('selected');
                    } else {
                        opt.classList.remove('selected');
                    }
                });
            
            // Show explanation
            if (showExplanation && q.explanation) {
                const questionDiv = document.getElementById(`question-${sectionIndex}-${qIdx}`);
                if (questionDiv) {
                    const explanationDiv = document.createElement('div');
                    explanationDiv.className = 'explanation';
                    explanationDiv.innerHTML = `
                        <strong>💡 Giải thích:</strong> ${q.explanation}
                    `;
                    questionDiv.appendChild(explanationDiv);
                }
            }
        });
        
        return score;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReadingRenderer;
}