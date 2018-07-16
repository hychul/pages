# REST 구성

자원 Resource - URI

행위 Verb - HTTP Method (POST, GET, PUT, DELETE - CRUD 순)

표현 Representations

# REST 아키텍처에 적용되는 6가지 제한조건

클라이언트/서버 구조

Stateless : 각 요청 간 클라이언트의 콘텍스트가 서버에 저장되어서는 안된다.

Cacheable : www와 같이 클라이언트는 응답을 캐시할 수 있다.

계층화(Layered System) : 클라이언트는 대상 서버에 직접 연결되었는지, 중간 서버에 연결되었는지 알 수 없다.

인터페이스 일관성 : 아키텍처를 단순화하고, 작은 단위로 분리(decouple) → 각 부분이 독립적으로 개선될 수 있다.

Code on Demand (optional) : 자바 애플릿이나 자바스크립트의 제공을 통에 클라이언트가 실행할 수 있는 로직을 전송 → 기능을 확장시킬 수 있다.

# REST에 대한 가이드 

## 중심 규칙

URI는 자원의 정보 표현. 

자원에 대한 행위는 METHOD로 표현.

- GET
- POST
- PUT
- DELETE

## URI 설계시 주의할 점

슬래시(/)로 계층 관계를 표현

URI 마지막 문자로 슬래시를 사용하지 않는다.

하이픈(-) 으로 가독성을 높인다 : 긴 URI는 하이픈으로 구분

밑줄(_)은 사용하지 않는다.

경로는 소문자로.

URI에 파일 확장자는 포함하지 않는다. :GET / members/soccer/345/photo HTTP/1.1 Host: restapi.example.com Accept: image/jpg

## Resource간의 관계 표현

ex)GET : /users/{userid}/devices (일반적으로 소유 ‘has’의 관계를 표현할 때)

## Collection과 Document

Document : 문서, 객체. Collection : Document의 집합.
ex) 
http:// restapi.example.com/sports/soccer
sports : collection (복수형)
soccer : document

## HTTP Request 상태코드

### 상태코드	

200	클라이언트의 요청을 정상적으로 수행함
201	클라이언트가 어떠한 리소스 생성을 요청, 해당 리소스가 성공적으로 생성됨(POST를 통한 리소스 생성 작업 시)

### 상태코드	

400	클라이언트의 요청이 부적절 할 경우 사용하는 응답 코드
401	클라이언트가 인증되지 않은 상태에서 보호된 리소스를 요청했을 때 사용하는 응답 코드

(로그인 하지 않은 유저가 로그인 했을 때, 요청 가능한 리소스를 요청했을 때)
403	유저 인증상태와 관계 없이 응답하고 싶지 않은 리소스를 클라이언트가 요청했을 때 사용하는 응답 코드

(403 보다는 400이나 404를 사용할 것을 권고. 403 자체가 리소스가 존재한다는 뜻이기 때문에)
405	클라이언트가 요청한 리소스에서는 사용 불가능한 Method를 이용했을 경우 사용하는 응답 코드

### 상태코드	

301	클라이언트가 요청한 리소스에 대한 URI가 변경 되었을 때 사용하는 응답 코드

(응답 시 Location header에 변경된 URI를 적어 줘야 합니다.)
500	서버에 문제가 있을 경우 사용하는 응답 코드



# 참고 

https://ko.wikipedia.org/wiki/REST
http://meetup.toast.com/posts/92