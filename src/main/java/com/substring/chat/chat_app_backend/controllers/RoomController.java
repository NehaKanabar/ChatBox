package com.substring.chat.chat_app_backend.controllers;

import com.substring.chat.chat_app_backend.Repositories.RoomRepositories;
import com.substring.chat.chat_app_backend.entities.Message;
import com.substring.chat.chat_app_backend.entities.Room;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {

    private final RoomRepositories roomRepository;

    public RoomController(RoomRepositories roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
        if (roomRepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room already exists!");
        }

        Room room = new Room();
        room.setRoomId(roomId);
        roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    // Get room (join)
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found!");
        }
        return ResponseEntity.ok(room);
    }

    // Get messages of a room with pagination
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Room room = roomRepository.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Message> messages = room.getMessages();
        int totalMessages = messages.size();
        int start = Math.max(0, totalMessages - (page + 1) * size);
        int end = Math.min(totalMessages, start + size);

        if (start >= totalMessages) {
            return ResponseEntity.ok(List.of()); // Return empty list if the page is out of range
        }

        List<Message> paginatedMessages = messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);
    }
}
