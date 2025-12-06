# Use official Java 21 image
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy entire backend project
COPY . .

# Give permission to the Maven wrapper
RUN chmod +x mvnw

# Build the Spring Boot application
RUN ./mvnw clean install -DskipTests

# Run the built application
CMD ["java", "-jar", "target/*.jar"]
