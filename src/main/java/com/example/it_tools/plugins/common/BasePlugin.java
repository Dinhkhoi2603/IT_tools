package com.example.it_tools.plugins.common;

import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

public class BasePlugin extends Plugin {
    public BasePlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {
        System.out.println(getClass().getSimpleName() + " started");
    }

    @Override
    public void stop() {
        System.out.println(getClass().getSimpleName() + " stopped");
    }
}
