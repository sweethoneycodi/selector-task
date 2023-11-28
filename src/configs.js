export const DBConfig = {
  name: "SelectorsDb",
  version: 1,
  objectStoresMeta: [
    {
      store: "Selector",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "name", keypath: "name", options: { unique: false } },
        { name: "selector", keypath: "selector", options: { unique: false } },
        { name: "agree", keypath: "agree", options: { unique: false } },
      ],
    },
  ],
};
