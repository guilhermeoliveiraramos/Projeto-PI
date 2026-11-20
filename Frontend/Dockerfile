# Etapa 1: Build do projeto React
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Nota: Se você usa Vite, a pasta gerada é 'dist'. 
# Se usa Create React App (CRA), mude '/app/dist' para '/app/build' abaixo:
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
