export const removeClass = (element, ...classesToRemove) => 
    document.querySelector(element).classList.remove(...classesToRemove)