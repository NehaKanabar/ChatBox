package com.substring.chat.chat_app_backend.Repositories;

import com.substring.chat.chat_app_backend.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepositories extends MongoRepository<Room, String> {
    //get room using room id
    Room findByRoomId(String roomId);


}
