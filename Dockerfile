FROM node:22-slim AS build

WORKDIR /app
COPY package.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js ./
ENV VITE_CHAT_API=https://shopping-agent-chat-303328800445.us-central1.run.app
RUN npm install && npx vite build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
