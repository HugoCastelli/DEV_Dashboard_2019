FROM node:12.13.0
ADD . /app
WORKDIR ./app
COPY package*.json ./
ENV PATH /usr/app/node_modules/.bin:$PATH
RUN npm install -g @angular/cli
RUN npm install -qy
COPY . .

EXPOSE 4200

CMD npm start