# --- Build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Địa chỉ backend mà TRÌNH DUYỆT gọi tới (không phải địa chỉ giữa các container)
ARG VITE_API_URL=http://127.0.0.1:8010
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# --- Phục vụ file tĩnh ---
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
