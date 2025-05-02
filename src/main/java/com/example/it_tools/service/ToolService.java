package com.example.it_tools.service;

import com.example.it_tools.model.Tool;
import com.example.it_tools.repository.ToolRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ToolService {
    private final ToolRepository toolRepository;

    public ToolService(ToolRepository toolRepository) {
        this.toolRepository = toolRepository;
    }

    public List<Tool> getAllTools() {
        return toolRepository.findAll();
    }

    public Optional<Tool> getById(String id) {
        return toolRepository.findById(id);
    }

    public Tool updateTool(Tool tool) {
        return toolRepository.save(tool);
    }
}
