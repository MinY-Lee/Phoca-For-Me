# ReadMe

# PhocaForMe-포카포미: 아이돌 포토카드 교환 플랫폼

![Untitled.png](README%2FUntitled.png)

## ✨목차

---

- **프로젝트 소개**
- **프로젝트 개요**
- **개발 환경 및 IDE**
- **주요기능**

## ✨ 프로젝트 소개

---

### **💖** 주제

**포카포미**는 아이돌 팬들이 보다 쉽게 원하는 아이돌의 포토카드를 교환할 수 있도록 게시글 등록과 검색, 등록자와의 채팅 기능을 제공합니다. 

### 💻 기간

2024.01.02 ~ 2023.02.16

### 👀 목적 및 핵심내용

온라인 포토카드 교환 플랫폼 **포카포미**를 통해 GPS 거리 및 고도화된 검색으로 아이돌 포토카드를 교환할 수 있습니다. 

### 👪 참여 인원 및 역할

| 이름 | 역할 |
| --- | --- |
| *** | BackEnd & Team Leader |
| *** | BackEnd  |
| *** | BackEnd  |
| *** | BackEnd  |
| *** | FrontEnd |
| *** | FrontEnd |

## ✨ 프로젝트 개요

---

### 🏷️ **기존 교환 방식**

- **현장에서의 직접 교환**
    - 포토카드 구매 현장에서 대기하며 사람들에게 직접 물어보고 교환을 시도합니다.
- **SNS를 통한 교환**
    - X(구: 트위터)와 같은 SNS 플랫폼을 사용하여 교환 희망자를 검색하고 연락하여 교환합니다.

### 🚨 **기존 교환 방식의** 문제점

- **인원 문제**: 사람이 너무 많아 원하는 카드를 가진 사람을 찾기 어렵거나, 반대로 내가 현장에 있을 때 사람이 적어 교환 대상을 찾기 어려운 경우가 있습니다.
- **카드 불일치**: 현장에 있는 사람들 중에서도 내가 원하는 포토카드를 가진 사람이 없을 경우, 교환이 불가능합니다.
- **플랫폼 한계**: 교환을 위한 전용 플랫폼이 아닌 일반 SNS를 사용하기 때문에, 검색 효율성이 떨어집니다.
- **잡음 데이터**: 교환 관련 게시글을 검색하기 위해 불필요한 태그를 사용하면, 관련 없는 내용의 게시글이 대량으로 검색되어 교환하는 입장에서 잡음 데이터를 걸러내는 데 시간을 소모해야 합니다.

## **⚙︎** 개발 환경 및 IDE

---

**FrontEnd**

- React - 18.2.0
- react-redux - 9.1.0
- @reduxjs/toolkit - 2.1.0
- react-router-dom - 6.21.3
- react-dom - 18.2.0
- axios - 1.6.7
- @stomp/stompjs - 7.0.0
- sockjs-client - 1.6.1
- Node - 20.9.0
- mui

**BackEnd**

- Java - 17
- SpringBoot - 3.2.2
- SpringSecurity - 6.2.1
- Kakao Login
- Oauth2
- Firebase FCM - 10.8.0
- Websocket
- STOMP - 2.3.3
- Elastic Search - 8.12.0

**DB**

- MariaDB - 10.11.16
- Redis - 7.2.3
- AWS S3
- Rabbit MQ

**Server**

- Amazon EC2
- Jenkins
- Nginx
- Docker

## 🔎 주요 기능

---

- 카카오 로그인을 통한 로그인 / 로그아웃
- 교환을 위한 게시글 작성
- 원하는 포토카드를 찾기 위한 GPS 및 키워드 검색
- 1대 1 채팅을 통한 포토카드 교환
- 채팅 및 키워드에 대한 실시간 알림

## 📱 화면 설계서

---

![Untitled 1.png](README%2FUntitled%201.png)

## ✨API 명세서

---

[https://eastern-wrist-127.notion.site/API-2e61d4f4796b493ebe040852d4813b34?pvs=4](https://www.notion.so/API-2e61d4f4796b493ebe040852d4813b34?pvs=21)

## :아키텍처

---

![arc.jpg](README%2Farc.jpg)

## 📱 서비스 화면

---

1. 메인화면

![Untitled 2.png](README%2FUntitled%202.png)

![Untitled 3.png](README%2FUntitled%203.png)

2. 로그인

![Untitled 4.png](README%2FUntitled%204.png)

![Untitled 5.png](README%2FUntitled%205.png)

3. 로그아웃

![Untitled 6.png](README%2FUntitled%206.png)

![Untitled 7.png](README%2FUntitled%207.png)

4. 게시물 작성

![Untitled 8.png](README%2FUntitled%208.png)

![Untitled 9.png](README%2FUntitled%209.png)

5. 채팅하기

![Untitled 10.png](README%2FUntitled%2010.png)

![Untitled 11.png](README%2FUntitled%2011.png)

6. 검색하기

![Untitled 12.png](README%2FUntitled%2012.png)

![Untitled 13.png](README%2FUntitled%2013.png)

![Untitled 12.png](README%2FUntitled%2012.png)

![Untitled 14.png](README%2FUntitled%2014.png)



7. 갈망포카 알림 및 채팅 알림

![Untitled.jpeg](README%2FUntitled.jpeg)
