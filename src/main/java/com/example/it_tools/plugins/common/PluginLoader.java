package com.example.it_tools.plugins.common;

import org.pf4j.DefaultPluginManager;
import org.pf4j.PluginManager;
import java.nio.file.Paths;
import java.util.List;

public class PluginLoader {
    private static final PluginManager pluginManager = new DefaultPluginManager(Paths.get("plugins/tools"));

    public static void loadPlugins() {
        pluginManager.loadPlugins();
        pluginManager.startPlugins();
    }

    public static List<ToolInterface> getExtensions() {
        return pluginManager.getExtensions(ToolInterface.class);
    }
}
