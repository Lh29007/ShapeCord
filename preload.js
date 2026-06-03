// Preload optimisé : réduit les animations sans casser les images Discord
window.addEventListener('DOMContentLoaded', () => {
  try {
    const css = `
      /* Désactiver les animations pour réduire l'utilisation CPU */
      * { 
        transition: none !important; 
        animation: none !important; 
      }

      /* Réduire les effets lourds */
      .shimmer-3sH3w2,
      .animatedContainer-1pJv5C,
      .wrapper-3WhCwL {
        animation: none !important;
      }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head && document.head.appendChild(style);
  } catch (e) {
    console.error('preload css injection failed', e);
  }
});
