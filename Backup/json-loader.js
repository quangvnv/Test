/**
 * JSON Loader Module
 * Load dữ liệu câu hỏi từ file JSON
 */
const JSONLoader = {
    /**
     * Load questions from JSON file
     * @param {string} filename - Tên file JSON cần load
     * @returns {Promise<Array>} - Promise chứa mảng sections
     */
    async loadQuestions(filename) {
        try {
            const response = await fetch(filename);
            
            if (!response.ok) {
                throw new Error(`Không tìm thấy file ${filename}`);
            }
            
            const sections = await response.json();
            
            if (!sections || sections.length === 0) {
                throw new Error('File JSON không có dữ liệu');
            }
            
            return sections;
            
        } catch (error) {
            throw error;
        }
    },
    
    /**
     * Show loading state
     */
    showLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = 'block';
        }
    },
    
    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingEl = document.getElementById('loading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    },
    
    /**
     * Show error message
     * @param {Error} error - Error object
     * @param {string} filename - Tên file bị lỗi
     */
    showError(error, filename) {
        const errorEl = document.getElementById('error');
        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = `
                <strong>Lỗi:</strong> ${error.message}<br>
                <small>Hãy đảm bảo file "${filename}" nằm cùng thư mục với file HTML này.</small>
            `;
        }
        console.error('Error loading JSON:', error);
    },
    
    /**
     * Hide error message
     */
    hideError() {
        const errorEl = document.getElementById('error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JSONLoader;
}