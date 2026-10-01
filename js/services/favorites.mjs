import { get, set } from './storage.js';

const KEY = 'favorites';

const empty = () => ({
    developers: [],
    repositories: [],
    articles: []
});


export const favorites = {

    all: () => get(KEY, empty()),

    list: (type) => {
        return get(KEY, empty())[type] || [];
    },

    isSaved: (type, id) => {
        return favorites
            .list(type)
            .some(
                (item) =>
                    String(
                        item.id ||
                        item.login ||
                        item.html_url
                    ) === String(id)
            );
    },

    toggle: (type, item) => {
        const data = favorites.all();

        const id = String(
            item.id ||
            item.login ||
            item.html_url
        );

        const list = data[type] || [];

        const index = list.findIndex(
            (existingItem) =>
                String(
                    existingItem.id ||
                    existingItem.login ||
                    existingItem.html_url
                ) === id
        );

        if (index >= 0) {
            // Remove from favorites
            list.splice(index, 1);
        } else {
            // Add to favorites
            list.push(item);
        }

        data[type] = list;

        set(KEY, data);

        // Returns true when the item was added,
        // false when it was removed.
        return index < 0;
    }
};