import storage from "@sitevision/api/server/storage";
const dataStore = storage.getCollectionDataStore('feedback');

export const getPrevFeedback = (id) => {
    const feedbackPosts = dataStore.find(`ds.analyzed.pageId:${id}`, 10).toArray();
    return feedbackPosts;
};