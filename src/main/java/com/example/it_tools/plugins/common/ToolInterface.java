package com.example.it_tools.plugins.common;

import org.pf4j.ExtensionPoint;

public interface ToolInterface extends ExtensionPoint {
    String execute();
}
