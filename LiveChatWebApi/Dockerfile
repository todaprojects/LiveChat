FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src

COPY ["LiveChatWebApi.Application/LiveChatWebApi.Application.csproj", "LiveChatWebApi.Application/"]
RUN dotnet restore "LiveChatWebApi.Application/LiveChatWebApi.Application.csproj"

COPY ["LiveChatWebApi.WebApi/LiveChatWebApi.WebApi.csproj", "LiveChatWebApi.WebApi/"]
RUN dotnet restore "LiveChatWebApi.WebApi/LiveChatWebApi.WebApi.csproj"

COPY . .
WORKDIR "/src/LiveChatWebApi.WebApi"
RUN dotnet build "LiveChatWebApi.WebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LiveChatWebApi.WebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LiveChatWebApi.WebApi.dll"]