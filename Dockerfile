FROM openjdk:17-jdk-slim AS build  # ✅ Make sure the correct Java version is used

WORKDIR /app
COPY target/GrandSpaceProject.jar app.jar
EXPOSE 2001
ENTRYPOINT ["java", "-jar", "app.jar"]