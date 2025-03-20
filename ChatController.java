package com.substring.chat.chat_app_backend.controllers;

import com.substring.chat.chat_app_backend.Repositories.RoomRepositories;
import com.substring.chat.chat_app_backend.entities.Message;
import com.substring.chat.chat_app_backend.entities.Room;
import com.substring.chat.chat_app_backend.playload.MessageRequest;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Controller
public class ChatController {
    //will help to controll the chats for group
    //create room
    //get room
    //get messages of room


    private RoomRepositories roomRepositories;

    public ChatController(RoomRepositories roomRepositories) {
        this.roomRepositories = roomRepositories;
    }
    //for sending and receving messages
    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ) throws Exception {
       Room room= roomRepositories.findByRoomId(request.getRoomId());

       Message message = new Message();
       message.setContent(request.getContent());
       message.setSender(request.getSender());
       message.setTimeStamp(LocalDateTime.now());
       if(room != null) {
           room.getMessages().add(message);
           roomRepositories.save(room);

       }
       else {
           throw new RuntimeException("room not found");
       }
       return message;
    }
}
