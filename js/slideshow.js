class CustomSlideshow extends HTMLElement {
  connectedCallback() {
    try {
      const scriptTag = this.querySelector('script[type="application/json"]');
      if (!scriptTag) return;
      
      const rawData = scriptTag.textContent.trim();
      this.images = JSON.parse(rawData);
    } catch (e) {
      console.error("Slideshow Fehler: JSON konnte nicht geparst werden.", e);
      return;
    }

    if (!this.images || this.images.length <= 1) {
      console.log("Slideshow: Nicht genug Bilder für einen Wechsel.");
      return;
    }

    // Bilder-Array mischen (Random Order) via Fisher-Yates Shuffle
    for (let i = this.images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.images[i], this.images[j]] = [this.images[j], this.images[i]];
    }

    this.currentIndex = 0;
    this.imgElement = this.querySelector('.slideshow-image');
    if (!this.imgElement) return;

    // Setze direkt das erste (nun zufällige) Bild
    this.imgElement.src = this.images[this.currentIndex];

    this.preloadImage(1); // Zweites Bild vorladen

    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.imgElement.src = this.images[this.currentIndex];

      const nextIndex = (this.currentIndex + 1) % this.images.length;
      this.preloadImage(nextIndex);
    }, 7000);
  }

  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  preloadImage(index) {
    if (this.images && this.images[index]) {
      const img = new Image();
      img.src = this.images[index];
    }
  }
}

customElements.define('custom-slideshow', CustomSlideshow);
