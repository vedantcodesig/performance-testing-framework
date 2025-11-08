Write-Host "Fixing Docker setup..." -ForegroundColor Green

# Remove empty Dockerfiles
Remove-Item backend\Dockerfile -Force -ErrorAction SilentlyContinue
Remove-Item frontend\Dockerfile -Force -ErrorAction SilentlyContinue
Remove-Item frontend\nginx.conf -Force -ErrorAction SilentlyContinue

# Create backend Dockerfile
@'
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
'@ | Out-File -FilePath "backend\Dockerfile" -Encoding utf8

# Create frontend Dockerfile
@'
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
'@ | Out-File -FilePath "frontend\Dockerfile" -Encoding utf8

# Create nginx config
@'
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
'@ | Out-File -FilePath "frontend\nginx.conf" -Encoding utf8

Write-Host "Files created successfully!" -ForegroundColor Green
Write-Host "Backend Dockerfile size: $(Get-Item backend\Dockerfile).Length bytes" -ForegroundColor Cyan
Write-Host "Frontend Dockerfile size: $(Get-Item frontend\Dockerfile).Length bytes" -ForegroundColor Cyan

# Try docker-compose
Write-Host "Starting Docker Compose..." -ForegroundColor Yellow
docker-compose up --build