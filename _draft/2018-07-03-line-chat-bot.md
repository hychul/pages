---
title: LINE 챗봇 만들기
date: 2018-07-03
categories:
- Toy Project
tags:
- Development
- Java
- Spring
- Heroku
---

라인 Message API 를 통해 라인 챗봇 만들기

https://developers.line.me/en/docs/messaging-api/building-bot/

https://github.com/line/line-bot-sdk-java/blob/master/sample-spring-boot-echo/README.md



라인 봇에 예시로 든 헤로쿠를 사용하여 호스팅

새로운 채널을 만듬

채널에 메세지를 받기 위한 서버 webhook 등록

서버에 채널 변수 등록

빌드



스프링으로 혼자서 만들어 볼게 없을까 하다가 간단한 챗봇을 하나 만들었다. 점심시간의 메뉴를 랜덤하게 추천해주는 챗봇인데, 회사에서 사용하는 LINE 메신저에 챗봇을 위한 Messaging API를 지원하고 있기 때문에 간편하게 만들 수 있었다.

준비

https://developers.line.me/en/docs/messaging-api/building-bot/

