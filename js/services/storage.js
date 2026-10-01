const PREFIX = 'dtx:';


export function get(key, fallback = null) {
    try {
        const raw = localStorage.getItem(`${PREFIX}${key}`);

        return raw === null
            ? fallback
            : JSON.parse(raw);
    } catch {
        return fallback;
    }
}


export function set(key, value) {
    localStorage.setItem(
        `${PREFIX}${key}`,
        JSON.stringify(value)
    );

    return value;
}


export function remove(key) {
    localStorage.removeItem(`${PREFIX}${key}`);
}


export function clear() {
    Object.keys(localStorage)
        .filter((key) => key.startsWith(PREFIX))
        .forEach((key) => {
            localStorage.removeItem(key);
        });
}


export function has(key) {
    return localStorage.getItem(`${PREFIX}${key}`) !== null;
}


export function update(key, updater, fallback = []) {
    const currentValue = get(key, fallback);
    const updatedValue = updater(currentValue);

    return set(key, updatedValue);
}