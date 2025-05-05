package com.example.it_tools.service;

import com.example.it_tools.dto.EmailRequest;
import com.example.it_tools.dto.EmailResponse;
import org.springframework.stereotype.Service;

import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;

import java.util.Hashtable;
import java.util.regex.Pattern;

@Service
public class EmailService {
    private static final Pattern EMAIL_REGEX =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public EmailResponse parseEmail(EmailRequest request) {
        EmailResponse response = new EmailResponse();
        response.setEmail(request.getEmail());

        boolean valid = EMAIL_REGEX.matcher(request.getEmail()).matches();
        response.setValid(valid);

        if (valid) {
            String[] parts = request.getEmail().split("@");
            String username = parts[0];
            String domain = parts[1];

            response.setUsername(username);
            response.setDomain(domain);

            boolean hasMX = hasMXRecord(domain);
            response.setHasMXRecord(hasMX);
        }

        return response;
    }

    private boolean hasMXRecord(String domain) {
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            DirContext ctx = new InitialDirContext(env);
            Attributes attrs = ctx.getAttributes(domain, new String[]{"MX"});
            return attrs != null && attrs.get("MX") != null;
        } catch (Exception e) {
            return false;
        }
    }
}
