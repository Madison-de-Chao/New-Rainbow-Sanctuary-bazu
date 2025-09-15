// Simple Typed.js replacement for local use
class Typed {
  constructor(selector, options = {}) {
    this.element = document.querySelector(selector);
    this.strings = options.strings || [];
    this.typeSpeed = options.typeSpeed || 50;
    this.backSpeed = options.backSpeed || 30;
    this.backDelay = options.backDelay || 1500;
    this.loop = options.loop !== false;
    this.currentStringIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    
    if (this.element && this.strings.length > 0) {
      this.start();
    }
  }
  
  start() {
    this.type();
  }
  
  type() {
    const currentString = this.strings[this.currentStringIndex];
    
    if (this.isDeleting) {
      this.currentText = currentString.substring(0, this.currentText.length - 1);
    } else {
      this.currentText = currentString.substring(0, this.currentText.length + 1);
    }
    
    this.element.textContent = this.currentText;
    
    let delay = this.isDeleting ? this.backSpeed : this.typeSpeed;
    
    if (!this.isDeleting && this.currentText === currentString) {
      // String is complete, start deleting after delay
      delay = this.backDelay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentText === '') {
      // Deletion complete, move to next string
      this.isDeleting = false;
      this.currentStringIndex = (this.currentStringIndex + 1) % this.strings.length;
      
      // If we don't loop and we've shown all strings, stop
      if (!this.loop && this.currentStringIndex === 0 && this.strings.length > 1) {
        this.currentStringIndex = this.strings.length - 1;
        this.currentText = this.strings[this.currentStringIndex];
        this.element.textContent = this.currentText;
        return;
      }
    }
    
    setTimeout(() => this.type(), delay);
  }
}

// Make it available globally
window.Typed = Typed;