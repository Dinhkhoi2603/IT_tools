package com.example.it_tools.controller;

import com.example.it_tools.model.Tool;
import com.example.it_tools.service.ToolService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import org.springframework.http.HttpStatus;

import java.io.FileOutputStream;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tools")
public class ToolController {
    private final ToolService toolService;

    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    @GetMapping
    public ResponseEntity<List<Tool>> getAllTools() {
        // Ensure Tool IDs are returned as Strings
        List<Tool> tools = toolService.getAllTools();
        tools.forEach(tool -> tool.setToolId(tool.getId().toHexString()));  // Use setToolId instead of settoolId
        return ResponseEntity.ok(tools);
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<?> toggleTool(
            @PathVariable("id") String id,
            @RequestParam boolean enabled,
            @RequestParam(required = false) Boolean premium
    ) {
        Optional<Tool> optionalTool = toolService.getById(id);
        if (optionalTool.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Tool tool = optionalTool.get();
        tool.setEnabled(enabled);
        if (premium != null) {
            tool.setPremium(premium);
        }

        return ResponseEntity.ok(toolService.updateTool(tool));
    }

    // Thêm hàm xóa tool
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTool(@PathVariable("id") String id) {
        Optional<Tool> optionalTool = toolService.getById(id);
        if (optionalTool.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        toolService.deleteTool(id); // Gọi service để xóa tool
        return ResponseEntity.noContent().build(); // Trả về 204 No Content nếu xóa thành công
    }
    @PostMapping
    public ResponseEntity<Tool> addTool(@RequestBody Tool tool) {
        Tool createdTool = toolService.addTool(tool);
        return ResponseEntity.ok(createdTool);
    }

    @PostMapping("/upload")
    public ResponseEntity<Tool> uploadToolWithFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tool") String toolJson) {
        try {
            // Parse tool JSON string to Tool object
            ObjectMapper mapper = new ObjectMapper();
            // Configure the mapper BEFORE parsing the JSON
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            
            Tool tool = mapper.readValue(toolJson, Tool.class);
            
            // Save tool to database first
            Tool savedTool = toolService.addTool(tool);
            
            // Create directories if they don't exist
            String projectRoot = System.getProperty("user.dir");
            String toolsDirectory = projectRoot + "/frontend/src/components/tools/" + tool.getCategory().toLowerCase();
            File directory = new File(toolsDirectory);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            // Generate file name from tool name
            String fileName = tool.getName().toLowerCase().replace(" ", "-") + ".jsx";
            File targetFile = new File(directory, fileName);
            
            // Save the file
            try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                fos.write(file.getBytes());
            }
            
            return ResponseEntity.ok(savedTool);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
}
