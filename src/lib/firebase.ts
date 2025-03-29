// Mock Firebase services

// Mock auth service
export const auth = {
  // Add any mock methods that might be needed by the application
  currentUser: {
    uid: "admin-user-id",
    email: "admin@zynkprint.com",
    displayName: "Admin User",
    emailVerified: true
  }
};

// Mock firestore service
export const db = {
  // Add any mock methods that might be needed by the application
  collection: () => ({
    add: async () => ({ id: `doc-${Date.now()}` }),
    doc: () => ({
      get: async () => ({ exists: true, data: () => ({}) }),
      set: async () => {},
      update: async () => {},
      delete: async () => {}
    })
  })
};

// Provide a default export for any direct imports of the app
export default { auth, db }; 