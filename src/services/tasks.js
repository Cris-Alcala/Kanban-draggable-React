export const getAll = (term) => {
    if (localStorage.getItem(term)===null) {
        localStorage.setItem(term, JSON.stringify([]));
        return [];
    } else {
        return JSON.parse(localStorage.getItem(term));
    }
}

export const save = (term, array) => {
    localStorage.setItem(term, JSON.stringify(array));
}