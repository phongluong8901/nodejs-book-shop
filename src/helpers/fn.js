// helpers/fn.js
export const generateCode = (value) => {
    let output = '';
    const words = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ');
    words.forEach(word => {
        if (word) output += word.charAt(0).toUpperCase();
    });
    return output + value.length;
}