/**
 * State Manager Module
 * Quản lý toàn bộ trạng thái của ứng dụng
 */
const StateManager = {
    // Data state
    allSections: [],
    currentSectionIndex: 0,
    userAnswers: {},
    
    // Font size state (Section1 settings)
    fontSize: 18, // Default for question number
    optionFontSize: 15, // Default for options
    explanationFontSize: 14, // Default for explanations (if any)
    
    // Initialize state
    init() {
        this.allSections = [];
        this.currentSectionIndex = 0;
        this.userAnswers = {};
        this.fontSize = 18;
        this.optionFontSize = 15;
        this.explanationFontSize = 14;
    },
    
    // Get current section
    getCurrentSection() {
        return this.allSections[this.currentSectionIndex];
    },
    
    // Set sections data
    setSections(sections) {
        this.allSections = sections;
    },
    
    // Set current section index
    setCurrentSectionIndex(index) {
        this.currentSectionIndex = index;
    },
    
    // Get user answer for a question
    getUserAnswer(sectionIdx, questionIdx) {
        const key = `${sectionIdx}-${questionIdx}`;
        return this.userAnswers[key];
    },
    
    // Set user answer for a question
    setUserAnswer(sectionIdx, questionIdx, optionIdx) {
        const key = `${sectionIdx}-${questionIdx}`;
        this.userAnswers[key] = optionIdx;
    },
    
    // Clear all user answers
    clearUserAnswers() {
        this.userAnswers = {};
    },
    
    // Get answered count
    getAnsweredCount() {
        const section = this.getCurrentSection();
        if (!section) return 0;
        
        let count = 0;
        for (let i = 0; i < section.questions.length; i++) {
            const key = `${this.currentSectionIndex}-${i}`;
            if (this.userAnswers[key] !== undefined) count++;
        }
        return count;
    },
    
    // Check if all questions are answered
    isAllAnswered() {
        const section = this.getCurrentSection();
        if (!section) return false;
        return this.getAnsweredCount() === section.questions.length;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}