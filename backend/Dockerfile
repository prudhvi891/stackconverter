# -------- STAGE 1: Build with Maven (no wrapper needed) --------
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download all dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY . .

# Build Spring Boot JAR
RUN mvn clean package -DskipTests


# -------- STAGE 2: Run the application --------
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
