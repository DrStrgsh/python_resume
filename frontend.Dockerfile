FROM node:20-alpine

WORKDIR /app

COPY resume-frontend/package*.json ./
RUN npm install

COPY resume-frontend/ .
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

RUN npm run build

CMD ["npm", "start"]
