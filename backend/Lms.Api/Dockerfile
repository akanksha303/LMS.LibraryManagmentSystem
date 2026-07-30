FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Copy solution and project files
COPY *.sln ./
COPY Lms.Core/*.csproj ./Lms.Core/
COPY Lms.Application/*.csproj ./Lms.Application/
COPY Lms.Infrastructure/*.csproj ./Lms.Infrastructure/
COPY Lms.Api/*.csproj ./Lms.Api/

# Restore dependencies
RUN dotnet restore

# Copy source code and build
COPY . .
RUN dotnet publish Lms.sln -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

EXPOSE 80
ENTRYPOINT ["dotnet", "Lms.Api.dll"]
