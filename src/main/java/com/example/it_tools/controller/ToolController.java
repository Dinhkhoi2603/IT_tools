package com.example.it_tools.controller;

import com.example.it_tools.model.Tool;
import com.example.it_tools.service.ToolService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
