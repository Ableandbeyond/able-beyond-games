// UI Module
export class UIManager {
    constructor(onCardClick) {
        this.imageContainer = document.getElementById('image-container');
        this.wordContainer = document.getElementById('word-container');
        this.onCardClick = onCardClick;
    }

    renderPairs(pairs) {
        this.imageContainer.innerHTML = '';
        this.wordContainer.innerHTML = '';

        // Randomize the arrays separately so pairs aren't side-by-side
        const images = [...pairs].sort(() => Math.random() - 0.5);
        const words = [...pairs].sort(() => Math.random() - 0.5);

        images.forEach(animal => {
            const card = this.createImageCard(animal);
            this.imageContainer.appendChild(card);
        });

        words.forEach(animal => {
            const card = this.createWordCard(animal);
            this.wordContainer.appendChild(card);
        });
    }

    createImageCard(animal) {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = animal.id;
        div.dataset.type = 'image';
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', `Image of ${animal.name}`);
        div.style.backgroundColor = animal.color;
        
        const content = document.createElement('span');
        content.className = 'card-image';
        content.textContent = animal.image;
        div.appendChild(content);

        this.attachCardEvents(div, animal);
        return div;
    }

    createWordCard(animal) {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = animal.id;
        div.dataset.type = 'word';
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', `Word ${animal.name}`);
        
        const content = document.createElement('span');
        content.className = 'card-word';
        content.textContent = animal.name;
        div.appendChild(content);

        this.attachCardEvents(div, animal);
        return div;
    }

    attachCardEvents(card, animal) {
        const trigger = () => {
            if (card.classList.contains('matched')) return;
            this.onCardClick(animal.id, card.dataset.type, card);
        };

        card.addEventListener('click', trigger);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger();
            }
        });
    }

    selectCard(card) {
        card.classList.add('selected');
    }

    deselectCard(card) {
        card.classList.remove('selected');
    }

    markMatched(card1, card2) {
        card1.classList.remove('selected');
        card2.classList.remove('selected');
        card1.classList.add('matched', 'animate-celebrate');
        card2.classList.add('matched', 'animate-celebrate');
        
        // Clean up ARIA state
        card1.setAttribute('aria-disabled', 'true');
        card2.setAttribute('aria-disabled', 'true');
    }

    clearSelections() {
        const selected = document.querySelectorAll('.card.selected');
        selected.forEach(c => c.classList.remove('selected'));
    }
}
