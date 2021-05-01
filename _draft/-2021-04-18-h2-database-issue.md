H2 데이터베이스를 프로젝트 테스트 환경 등에 적용하기 위해서 다음과 같이 H2 콘솔을 활성화하고 기본 값으로 설정하고 'http://localhost:8080/h2-console/'에 접속하여 Connect 버튼을 누르면 

```yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driverClassName: org.h2.Driver
    username: sa
    password:
  h2:
    console:
      enabled: true
```

![스크린샷 2021-04-18 오후 3 58 01](https://user-images.githubusercontent.com/18159012/115137100-e25c4580-a05e-11eb-8923-91110bf17c21.png)
