const _url = 'http://localhost:3000';

export const getAll = term => {
    return fetch(`${_url}/${term}`);
}
export const create = (term, object) => {
    return fetch(`${_url}/${term}`, {
        method:"POST",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(object)
    })
}
export const update = (term, object) => {
    return fetch(`${_url}/${term}/${object.id}`, {
        method:"PATCH",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(object)
    })
}
export const del = (term, id) => {
    return fetch(`${_url}/${term}/${id}`, {
        method:"DELETE"
    })
}
