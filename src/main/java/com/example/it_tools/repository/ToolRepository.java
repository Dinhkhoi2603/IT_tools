package com.example.it_tools.repository;

import com.example.it_tools.model.Tool;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ToolRepository extends MongoRepository<Tool, String> {
}
