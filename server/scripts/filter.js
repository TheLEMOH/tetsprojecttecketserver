const CreateFilter = (obj) => {
    const filter = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v != 'null'));
    return filter
}

module.exports = CreateFilter