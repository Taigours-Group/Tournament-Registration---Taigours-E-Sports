// Form validation and submission handler
class TournamentRegistration {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.btnLoader = document.getElementById('btnLoader');
        this.successModal = document.getElementById('successModal');
        this.modalClose = document.getElementById('modalClose');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.modalClose.addEventListener('click', this.closeModal.bind(this));
        this.addInputValidation();
        this.addScrollAnimations();
    }

    addInputValidation() {
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}Error`);
        let isValid = true;
        let errorMessage = '';
        if (field.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        }
        switch (fieldName) {
            case 'fullName':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Full name must be at least 2 characters long.';
                }
                break;
            case 'inGameName':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'In-game name must be at least 2 characters long.';
                }
                break;
            case 'freeFireUID':
                if (value && (value.length < 8 || value.length > 12)) {
                    isValid = false;
                    errorMessage = 'Free Fire UID must be between 8-12 digits.';
                }
                break;
            case 'whatsappNumber':
                if (value && !this.isValidPhoneNumber(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid WhatsApp number.';
                }
                break;
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
            case 'dateOfBirth':
                if (value && !this.isValidAge(value)) {
                    isValid = false;
                    errorMessage = 'You must be at least 13 years old to participate.';
                }
                break;
            case 'teamName':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Team name must be at least 2 characters long.';
                }
                break;
        }
        if (errorElement) {
            errorElement.textContent = errorMessage;
            field.classList.toggle('error', !isValid);
        }
        return isValid;
    }

    validateRegistrationType() {
        const registrationTypes = document.querySelectorAll('input[name="registrationType"]');
        const isSelected = Array.from(registrationTypes).some(radio => radio.checked);
        const errorElement = document.getElementById('registrationTypeError');
        if (!isSelected) {
            errorElement.textContent = 'Please select a registration type.';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }

    validateTerms() {
        const termsCheckbox = document.getElementById('acceptTerms');
        const errorElement = document.getElementById('acceptTermsError');
        if (!termsCheckbox.checked) {
            errorElement.textContent = 'You must accept the terms and conditions.';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) errorElement.textContent = '';
        field.classList.remove('error');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhoneNumber(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
        return phoneRegex.test(phone);
    }

    isValidAge(dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 13;
    }

    getFieldLabel(fieldName) {
        const labels = {
            'fullName': 'Full Name',
            'inGameName': 'In-Game Name',
            'freeFireUID': 'Free Fire UID',
            'whatsappNumber': 'WhatsApp Number',
            'email': 'Email',
            'dateOfBirth': 'Date of Birth',
            'province': 'Province',
            'city': 'City/Village',
            'teamName': 'Team Name',
            'server': 'Server'
        };
        return labels[fieldName] || fieldName;
    }

    async handleSubmit(e) {
        e.preventDefault();
        let isFormValid = true;
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (!this.validateField(input)) isFormValid = false;
        });
        if (!this.validateRegistrationType()) isFormValid = false;
        if (!this.validateTerms()) isFormValid = false;
        if (!isFormValid) {
            this.showError('Please fix all errors before submitting.');
            return;
        }
        const formData = this.getFormData();
        const message = this.createWhatsAppMessage(formData);
        const targetNumber = '9779766115626';
        const encodedMsg = encodeURIComponent(message);
        const waUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`;
        window.open(waUrl, '_blank');
        this.showSuccessModal();
        this.form.reset();
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    createWhatsAppMessage(data) {
        const message = `\n🎮 *FREE FIRE TOURNAMENT REGISTRATION* 🎮\n\n👤 *Player Information:*\n• Full Name: ${data.fullName}\n• In-Game Name: ${data.inGameName}\n• Free Fire UID: ${data.freeFireUID}\n• WhatsApp: ${data.whatsappNumber}\n• Email: ${data.email}\n• Date of Birth: ${data.dateOfBirth}\n\n📍 *Location:*\n• Province: ${data.province}\n• City/Village: ${data.city}\n\n🏆 *Tournament Details:*\n• Team Name: ${data.teamName}\n• Registration Type: ${data.registrationType}\n• Server: ${data.server}\n${data.referCode ? `• Refer Code: ${data.referCode}` : ''}\n\n📅 *Registration Date:* ${new Date().toLocaleDateString()}\n\n✅ Terms & Conditions: Accepted\n\n---\n*Taigours E-Sports Tournament*\n*Registration ID: ${Date.now()}*`;
        return message.trim();
    }

    showSuccessModal() {
        this.successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1001;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(255, 68, 68, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => { errorDiv.remove(); }, 5000);
    }

    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);
        const sections = document.querySelectorAll('.form-section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            observer.observe(section);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TournamentRegistration();
});

window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.style.display = 'none', 900);
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    .error { border-color: #ff4444 !important; box-shadow: 0 0 20px rgba(255, 68, 68, 0.3) !important; }
    .error-notification { animation: slideInRight 0.3s ease-out; }
`;
document.head.appendChild(style);
