FROM openjdk:17-jdk-slim AS build

WORKDIR /app
COPY target/GrandSpaceProject.jar app.jar
EXPOSE 2001
ENTRYPOINT ["java", "-jar", "app.jar"]