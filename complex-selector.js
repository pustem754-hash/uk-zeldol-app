/* ============================================
   COMPLEX SELECTOR & THEME SYSTEM
   ============================================ */

const ComplexTheme = {
    init() {
        this.loadSavedTheme();
        this.setupSelector();
        this.applyTheme();
    },
    
    complexes: {
        default: {
            name: 'Зелёная Долина',
            accent: '#8BC34A',
            accentDark: '#689F38'
        },
        northern: {
            name: 'Северный',
            accent: '#42A5F5',
            accentDark: '#1976D2'
        },
        southern: {
            name: 'Южный',
            accent: '#FFB300',
            accentDark: '#F57C00'
        }
    },
    
    current: 'default',
    
    loadSavedTheme() {
        const saved = localStorage.getItem('selectedComplex');
        if (saved && this.complexes[saved]) {
            this.current = saved;
        }
    },
    
    setupSelector() {
        const selector = document.getElementById('complexSelector');
        if (!selector) return;
        
        // Build options
        Object.entries(this.complexes).forEach(([key, complex]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = complex.name;
            if (key === this.current) option.selected = true;
            selector.appendChild(option);
        });
        
        // Listen for changes
        selector.addEventListener('change', (e) => {
            this.current = e.target.value;
            this.saveTheme();
            this.applyTheme();
            this.showThemePreview();
        });
    },
    
    saveTheme() {
        localStorage.setItem('selectedComplex', this.current);
    },
    
    applyTheme() {
        document.documentElement.setAttribute('data-complex', this.current);
        
        const complex = this.complexes[this.current];
        const root = document.documentElement;
        
        // Update CSS custom properties
        root.style.setProperty('--primary-accent', complex.accent);
        root.style.setProperty('--primary-accent-dark', complex.accentDark);
        
        // Update page title if needed
        const titleEl = document.querySelector('.complex-name');
        if (titleEl) {
            titleEl.textContent = complex.name;
        }
    },
    
    showThemePreview() {
        // Optional: Show a brief preview animation
        const body = document.body;
        body.style.transition = 'background-color 0.5s ease';
        
        setTimeout(() => {
            body.style.transition = '';
        }, 500);
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ComplexTheme.init());
} else {
    ComplexTheme.init();
}


