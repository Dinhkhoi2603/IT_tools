package com.example.it_tools.dto;

public class EmailResponse {
    private String email;
    private boolean valid;
    private String username;
    private String domain;
    private boolean hasMXRecord;
    // Getters and setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public boolean isHasMXRecord() { return hasMXRecord; }
    public void setHasMXRecord(boolean hasMXRecord) { this.hasMXRecord = hasMXRecord; }
}
