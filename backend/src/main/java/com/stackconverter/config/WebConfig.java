package com.stackconverter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",                // Local React Dev
                    "https://stackconverter.com",           // Production main domain
                    "https://www.stackconverter.com",       // www version
                    "https://stackconverter.vercel.app"     // Vercel preview URLs
                )
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
