FROM python:3.7-alpine

WORKDIR ./app

ADD . ./API

WORKDIR ./API

COPY . .

EXPOSE 5000

RUN apk add gcc --no-cache libressl-dev musl-dev libffi-dev

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

RUN pip install -r requirements.txt

CMD python3 API.py