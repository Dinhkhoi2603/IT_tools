package com.example.it_tools.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;

@Document(collection = "tools")
public class Tool {
    @Id
    private ObjectId id;

    private String toolId;

    private String name;
    private String description;
    private String category;
    private String path;
    private int order;
    private boolean enabled;
    private boolean premium;

    // Constructors
    public Tool() {}

    public Tool(String toolId,String name, String description, String category, String path,
                int order, boolean enabled, boolean premium) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.path = path;
        this.order = order;
        this.enabled = enabled;
        this.premium = premium;
        this.toolId = toolId;  // toolId có thể được thiết lập sau khi đối tượng được lưu vào database
    }

    // Getters and Setters
    public ObjectId getId() {
        return id;
    }

    // toolId getter trả về toolId nếu có, nếu không trả về _id (MongoDB tự động tạo khi lưu vào DB)
    public String getToolId() {
        return toolId != null ? toolId : (id != null ? id.toHexString() : null);
    }

    // toolId setter
    public void setToolId(String toolId) {
        this.toolId = toolId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public boolean isPremium() {
        return premium;
    }

    public void setPremium(boolean premium) {
        this.premium = premium;
    }

    // Phương thức này sẽ được gọi khi đối tượng Tool được lưu vào database
    public void setId(ObjectId id) {
        this.id = id;
        this.toolId = id.toHexString();  // Khi có ObjectId, tự động gán toolId
    }
}
