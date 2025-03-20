import { httpClient } from "../config/AxiosHelper";

// Create a new chat room
export const createRoomApi = async (roomDetail) => {
  try {
    const response = await httpClient.post(`/api/v1/rooms`, roomDetail, {
      headers: {
        "Content-Type": "application/json", // ✅ Corrected Content-Type
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error; // ✅ Ensures error handling in the calling function
  }
};

// Join an existing chat room
export const joinChatApi = async (roomId) => {
  try {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error joining chat:", error);
    throw error;
  }
};

// Fetch chat messages for a room
export const getMessages = async (roomId, size = 50, page = 0) => {
  try {
    const response = await httpClient.get(
      `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
