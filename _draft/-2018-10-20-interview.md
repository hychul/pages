솔직히 면접 같은데서 이런 개념 같은 것을 '알고있는지' 확인하는 것은 공감한다만, 정의를 줄줄이 '외웠는지' 확인하는 것은 실효성이 없다고 생각한다. 
~~그럴거면 기억력 테스트를 하면 되지 왜 면접을 왜 보는거여, 어차피 레퍼런스 문서 보면서 개발해야될 텐데..?~~

[JAVA](#java)  
[JDK](#jdk)  
[JVM](#jvm)  
[GC](#gc)  
[Spring](#spring)  
[Serailization](#serialization)  
[CORS](#cors)  
[DB](#db)  
[Transaction](#transaction)  
[MySQL](#mysql)  
[JPA](#jpa)  
[Cache](#cache)  
[Distributed Lock](#distributed-lock)  
[MSA](#msa)  
[Kafka](#kafka)  
[Spring Batch](#spring-batch)  

<a id="db"></a>
# DB 인덱싱의 특징
<!-- MySQL B+tree https://zorba91.tistory.com/293 -->
<!-- daangn -->
- 인덱스 목적이 질의 결과를 빠르게 찾는 데 목적이 있다.
- 데이터베이스에 레코드가 삽입, 삭제될 때마다 인덱스가 변경되어야 한다.
- 데이터베이스에서 인덱스는 별도의 자료 구조인 B-Tree와 같은 형태로 관리하게 된다. 인덱스 자료 구조도 디스크에 저장하여, 질의가 있을 경우 읽어와 사용하게 된다.

<!-- 
# DB 인덱스가 동작하지 않는 경우
- 컬럼에 인덱스가 설정된 경우에도, WHERE 절에 해당 컬럼에 대한 가공이 있는 경우,
 -->

# DB 인덱스는 항상 넣는게 좋을까?
<!-- daangn -->
- DB의 인덱스는 따로 저장공간을 사용하고, 추가/삭제 시에 B+Tree의 특성상 인덱스 트리를 재구성 해야되는 작업이 필요하기 때문에 모든 컬럼에 대해서 인덱스를 추가하는 것은 지양해야한다.
- 또한 특정 컬럼에 인덱스를 추가할 때 해당 컬럼이 얼마나 중복되는지, 카디널리티<sup>Cardinality</sup>를 고려해야 한다.

# DB Cardinality
<!-- daangn -->
<!-- https://itholic.github.io/database-cardinality/ -->
- 중복도가 낮으면 카디널리티가 높고, 중복도가 높으면 카디널리티가 낮다.
- DB 테이블에서 카디널리티가 낮은 컬럼에 대해서 인덱스를 생성하면 쿼리 결과물이 많아지기 때문에 효율이 적어진다.
- A, B, C 컬럼에 인덱스를 설정한 후 where 절에 카디널리티가 오름차순인 컬럼을 조건으로 설정한 경우 조건을 순서대로 질의하면서 많은 수의 로우가 검색이 되기 때문에, where 절에 카디널리티가 높은 순서의 조건을 먼저 두는 것이 좋다.

</br>

<a id="transaction"></a>
# 트랜잭션 ACID
원자성<sup>Atomicity</sup>
- 트랜잭션과 관련된 작업들이 부분적으로 실행되다가 중단되지 않는 것을 보장하는 것을 의미

일관성<sup>Consistency</sup>
- 트랜잭션이 실행을 성공적으로 완료하면 언제나 일관성 있는 데이터베이스의 제약등을 지킨 상태로 유지하는 것을 의미

독립성<sup>Isolation</sup>
- 트랜잭션을 수행 시 다른 트랜잭션의 연산 작업이 끼어들지 못하도록 보장하는 것을 의미

영속성<sup>Durability</sup>
- 성공적으로 수행된 트랜잭션은 영원히 반영되어야 함을 의미

# 로컬 트랜젝션과 글로벌 트랜젝션
로컬 트랜젝션
- 트랜젝션은 Connection 오브젝트 안에서 만들어지기 때문에 일련의 작업이 하나의 트랜잭션으로 묶이려면 작업이 진행되는 동안 DB 커넥션도 하나만 사용돼야 한다.
- 스프링에선 이를 위해 Connection을 특별한 저장소에 보관하고 DAO의 메소드에서 이를 가져다 사용하게 하여 트랜젝션을 동기화한다.

글로벌 트랜젝션
- 로컬 트랜잭션과 달리 여러 DB 커넥션에 대해 트랜잭션을 관리하는 방식이다.

# JTA<sup>Java Transaction API</sup>
<!-- TODO -->

# 트랜잭션 Isolation Level
<!-- daangn -->
<!-- https://nesoy.github.io/articles/2019-05/Database-Transaction-isolation -->
동시에 여러 트랜젝션이 처리될 때, 특정 트랜젝션이 다른 트랜잭션에서 변경하거나 조회하는 데이터를 볼 수 잇도록 허용할지 말지 결정하는 레벨

**READ UNCOMMITED**
- SELECT 쿼리 시 다른 트랜잭션에서 COMMMIT 되지 않은 데이터를 읽어올 수 있다.
- COMMIT 되지 않은 데이터를 읽는 것을 Dirty Read라고 한다.
- ROLLBACK 될 수 있는 데이터를 읽을 수 있기 때문에 주의 해야한다.

**READ COMMITED**
- COMMIT이 완료된 데이터만 SELECT 시에 보이는 수준을 보장
- 대부분의 RDB에서 기본적으로 사용되는 격리수준
- Dirty Read가 발생하지 않도록 보장한다.
- 한 트랜잭션에서 SELECT를 수행할 때 동일한 데이터를 보장하지 않는다. 다른 트랜잭션에서 해당 데이터를 COMMIT 한 경우 데이터가 변경될 수 있기 때문이다. 
- 트랜잭션에서 COMMIT을 수행하지 않더라도 DB에 이미 값이 반영되어 있는 상태인 경우. COMMIT 이전 데이터를 보장하기 위해 Consistent Read를 수행해야한다.
- READ COMMITED를 Non-repeatable Read라고도 한다.

> **Consistent Read**
> Consistent read란 read(=SELECT) operation을 수행할 때 현재 DB의 값이 아닌 특정 시점의 DB snapshot을 읽어오는 것이다. 물론 이 snapshot은 commit 된 변화만이 적용된 상태를 의미한다.

**REPREATABLE READ**
- READ CONNITED와 다르게 트랜잭션 안에서 반복해서 SELECT 를 수행하더라도 동일한 값을 보장한다.
- 처음 SELECT 를 수행한 시간을 기록한 뒤, 이후에는 모든 SELECT마다 해당 시점을 기준으로 Consistent Read를 수행한다.
- 트랜잭션 도중 다른 트랜잭션이 COMMIT 되더라도 첫 SELECT 시에 생성된 Snapshot을 기준으로 하기에 새롭게 COMMIT 된 데이터는 보이지 않는다.

**SERIALIZABLE**  
- 모든 작업을 하나의 트랜잭션에서 처리하는 것과 같은 가장 높은 고립수준을 제공한다.
- READ COMMITED와 REPEATABLE READ 에서 발생하는 공통적인 이슈는 Phantom Read 가 발생한다는 것이다.

> **Phantom Read**
> 하나의 트랜잭션에서 UPDATE 명령이 유실되거나 덮어써질수 있는 즉, UPDATE후 COMMIT하고 다시 조회를 했을때 예상과는 다른 값이 보이거나 데이터가 유실된 경우를 Phantom Read라고 한다.

- SERIALIZABLE 의 경우 읽기 작업에도 공유 잠금<sup>S Lock</sup>을 설정하며 동작하여, 동시에 다른 트랜잭션에서 레코드를 변경하지 못하게 된다.
- 하지만 두개의 트랜잭션에서 (1-S Lock) - (2-S Lock) - (2-X Lock) - (1-X Lock) 순서로, 같은 레코드에 접근하는 경우 데드락이 발생할 수 있기 때문에 유의 해야한다.

> **공유 잠금<sup>S Lock : Shared Lock</sup>**
> 읽기 잠금<sup>Read Lock</sup>이라고도 불리며, 어떤 트랜잭션에서 데이터를 접근하고자 할 때, 다른 S Lock은 가능하지만 X Lock은 불가능하다.
> 쉽게 말해 릴소스를 다른 트랜잭션이 동시에 읽을 수는 일지만, 변경은 불가능하게 한다.
>
> **베타적 잠금<sup>X Lock : Exclusive Lock</sup>**
> 쓰기 잠금<sup>Write Lock</sup>이라고도 불린며, 트랜잭션에서 데이티를 변경하고자 할 때, 해당 트랜잭션이 완료 될 때까지 해당 테이블 혹은 레코드를 다른 트랜잭션에서 읽거나 쓰지 못하게 하기 위해 사용한다.

| Isolataion Level | Dirty Read | Non-Repeatable Read | Phantom Read |
| - | - | - | - |
| READ UNCOMMITED | 가능 | 가능 | 가능 |
| READ COMMITED | 불가능 | 가능 | 가능 |
| REPEATABLE READ| 불가능 | 불가능 | 가능 |
| SERIALIZABLE READ | 불가능 | 불가능 | 불가능 |
<!-- https://velog.io/@lsb156/Transaction-Isolation-Level#read-uncommitted -->

# CRUD에 적합한 DB Isolation Level
- Read시에 REPEATABLE READ
- Create, Update, Delete 시에 SERIALIZABLE

</br>

<a id="mysql"></a>
# MySQL 
MySQL은 크게 서버 엔진과 스토리지 엔진으로 구성되어 있다.

**서버 엔진**
- 쿼리 요청이 왔을 때 쿼리 파싱(Query parsing)을 하여 스토리지 엔진에 데이터를 요청하는 작업을 한다.

**스토리지 엔진**
- 물리적 저장장치에서 데이터를 읽어오는 작업을 한다.

# MySQL Storage Engine
<!-- http://asuraiv.blogspot.com/2017/07/mysql-storage-engine.html -->
- 스토리지 엔진은 물리 저장장치에서 데이터를 읽어오는 역할을 담당한다.  
- MySQL의 스토리지 엔진을 플러그인 방식이며, 기본적으로 8가지의 스토리지 엔진이 탑재되어있다.

**InnoDB**
- 따로 스토리지 엔진을 명시하지 않으면 default 로 설정되는 스토리지 엔진이다. InnoDB는 transaction-safe 하며, 커밋과 롤백, 그리고 데이터 복구 기능을 제공하므로 데이터를 효과적으로 보호 할 수 있다.
- InnoDB는 기본적으로 row-level locking 제공하며, 또한 데이터를 clustered index에 저장하여 PK 기반의 query의 I/O 비용을 줄인다. 또한 FK 제약을 제공하여 데이터 무결성을 보장한다.
- 트랜잭션을 지원한다.
- MyISAM이 테이블 단위의 Lock을 지원하는 것과 달리 InnoDB는 로우(행) 단위 Lock을 사용하기 때문에 INSERT, UPDATE, DELETE 에 대한 속도가 빠르다.
- 시스템 자원을 많이 사용한다.

**MyISAM**
- 트랜잭션을 지원하지 않고 table-level locking을 제공한다. 따라서 multi-thread 환경에서 성능이 저하 될 수 있다. 특정 세션이 테이블을 변경하는 동안 테이블 단위로 lock이 잡히기 때문이다.
- 텍스트 전문 검색(Fulltext Searching)과 지리정보 처리 기능도 지원되는데, 이를 사용할 시에는 파티셔닝을 사용할 수 없다는 단점이 있다.
- 엔진이 기본적인 기능만 제공하기 때문에 SELECT가 빠르다.
- 쓰기 작업시 Table level locking이 걸리기 때문에 상당히 속도가 느리다.
- 외래키의 생성이 불가능하다.

|  | MyISAM | InnoDB |
| - | - | - |
| 최대용량 | 256TB | 64TB |
| 트랜잭션 | 미지원 | 지원 |
| B-Tree 인덱스 | 지원 | 지원 |
| Hash 인덱스 | 미지원 | 미지원 |
| Full text search index | 지원 | 미지원 |
| 외래키 | 미지원 | 지원 |
| 모델 복잡도 | 단순 | 복잡 |
| 무결성 | 미지원 | 지원 |
| 시스템 자원 사용 | 적음 | 많음 |
| 복구 | 미지원 | 지원 |
| Lock | Table Level Locking | Row Level Locking |

> **Full-text Index**  
> 한 컬럼안에 많은 형태의 데이터가 담겨있어(한글, 영어, 숫자 등이 섞여있거나, 그 길이가 긴 경우) 효율적으로 데이터를 찾는 경우에 사용한다. 컬럼을 토큰으로 나눠 인덱스 데이터를 생성한다. 
> 컬럼을 토큰으로 나누기 위해, 구분 문자<sup>Stop-word</sup>를 사용하는 Stop-word 파서와 토큰의 크기 N만큼씩 인덱스로 파싱해두었다가 사용하는 N-gram 파서를 사용한다.
<!-- https://www.mssqltips.com/sqlservertutorial/9136/sql-server-full-text-indexes/ -->

<a id="serialization"></a>
# 자바 직렬화<sup>Serialization</sup>
<!-- daangn -->
<!-- https://woowabros.github.io/experience/2017/10/17/java-serialize.html -->
**직렬화**
- 자바 직렬화란 자바 시스템 내부에서 사용되는 객체 또는 데이터를 외부의 자바 시스템에서도 사용할 수 있도록 바이트(byte) 형태로 데이터 변환하는 기술과 바이트로 변환된 데이터를 다시 객체로 변환하는 기술(역직렬화)을 아울러서 이야기한다.
- 시스템적으로 이야기하자면 JVM(Java Virtual Machine 이하 JVM)의 메모리에 상주(힙 또는 스택)되어 있는 객체 데이터를 바이트 형태로 변환하는 기술과 직렬화된 바이트 형태의 데이터를 객체로 변환해서 JVM으로 상주시키는 형태를 같이 이야기한다.
- JVM 메모리에 존재하던 객체 데이터를 영속화하여 네트워크로 전송하거나 저장할때 사용한다.

# 자바 SerialVersionUID
<!-- daangn -->
<!-- https://blog.javabom.com/minhee/spring-boot/undefined/serializable-1 -->
- 직렬화에 사용되는 클래스의 직렬화 버전이다.
- 필수값은 아니다.
- 호환 가능한 클래스는 SUID 값이 동일하다.
- SUID 값이 명시적으로 선언되어있지 않으면 클래스의 기본 해쉬값을 사용한다.
<!-- 자동생성 SUID는 클래스 구조를 사용 https://docs.oracle.com/javase/6/docs/platform/serialization/spec/class.html#4100 -->

**SUID 버전을 체크하는 이유**
- 버전이 바뀌면 객체ㅔ의 상태가 조금이라도 바뀌었다는 것을 의미하기 때문에 역직렬화 과정에서 오류가 발생할 수 있다.
- SUID를 직접 설정하여 관리해야 클래스의 변경이 있을 때, 혼란을 줄일 수 있다.

**SUID 저번이 같을 때 문제가 발생하는 경우**
- 멤버 변수명은 같은데 멤버 변수 타입이 변경된 경우. ex) String -> StringBuilder
- 멤버 변수의 프리미티브 타입을 변경하는 경우. ex) int -> long
- SUID 값이 동이리하면 멤버 변수 추가는 문제되지 않지만, 변수명 변경/변수 삭제는 오류를 발생키지 않고 데이터가 누락된다.

# 자바 직렬화를 사용하는 곳
<!-- daangn -->
**서블릿 세션**
- 서블릿 기반의 WAS(톰캑, 웹로직 등)는 대부분 세션의 자바 직렬화를 지원하고 있다.
- 단순히 메모리에서 운용되면 직렬화가 필요하지 않지만, 파일로 저장하거나 세션 클러스터링, DB를 사용하는 옵션등을 선택하면 세션 자체가 직렬화되어 저장된다.

**캐시**
- 자바 시스템에서 퍼포먼스 향상을 위해 DB에서 가져온 엔티티등을 메모리, 외부 저장소, 파일 등의 저장소에 저장한 후 동일한 요청이 오면 DB가 아닌 저장소에서 객체를 찾아 응답한다.
- 엔티티가 캐시될 때 직렬화를 사용하여 저장한다. (자바 직렬화만 이용해서 캐시를 저장하지는 않지만 가장 간편하기 때문에 많이 사용된다.)

**자바 RMI<sup>Remote Method Invocation</sup>**
- 최근에는 많이 사용되지 않지만, 원격 시스템간의 메세지 교환을 위해 자바에서 지원하는 기술
- 원격의 시스템의 메서드에 메세지(보통 객체)를 전달하기 위해 직렬화를 사용한다.

</br>

# 동기 vs 비동기
<!-- daangn -->
호출된 함수의 작업 완료를 누가 신경 쓰느냐가 중점

**동기**
- 호출한 함수가 작업 완료를 신경 쓴다.

**비동기**
- 호출된 함수(callback 함수)가 작업 완료를 신경 쓴다.

# 블록킹 vs 논블록킹
<!-- daangn -->
호출되는 함수가 바로 리턴하느냐 마느냐가 중점

**블록킹**
- 호출된 함수가 자신의 작업을 모두 끝낼때까지 제어권을 가지고 있어 호출한 함수가 대기하도록 만듦
- 스레드의 관점에서, 요청한 작업을 완료할 때까지 계속 대기하며 return 받을 때까지 block 되어 한 스레드를 계속 사용한다.

**논블록킹**
- 호출된 함수가 바로 return 해서 호출한 함수에게 제어권을 주어 다른 일을 할 수 있게 함
- 스레드의 관점으로 본다면, 하나의 스레드가 여러 IO를 처리 가능하다.

# 동기/비동기 + 블록킹/논블록킹
**동기 + 블록킹**  
![sync-blocking-1](https://user-images.githubusercontent.com/18159012/117162983-3193cb80-adfe-11eb-816b-bd84c8f80578.png)

**비동기 + 블록킹**  
![sync-blocking-2](https://user-images.githubusercontent.com/18159012/117162987-32c4f880-adfe-11eb-890b-7f34da4d88b6.png)

**동기 + 논블록킹**  
![sync-blocking-3](https://user-images.githubusercontent.com/18159012/117162991-335d8f00-adfe-11eb-9f32-da701c060f06.png)

**비동기 + 논블록킹**  
![sync-blocking-4](https://user-images.githubusercontent.com/18159012/117162994-33f62580-adfe-11eb-8b9d-deb18301bac1.png)

# 동시성 vs 병렬성
**동시성**
- 동시에 실행되는 것 같이 보이는 것
- 싱글 코어에서 멀티 스레드를 동작 시키는 방식
- 논리적인 개념

**병렬성**
- 실제로 동시에 여러 작업이 처리되는 것
- 멀티 코어에서 멀티 스레드를 동작시키는 것
- 물리적인 개념

</br>

<a id="cors"></a>
# CORS
<!-- daangn -->
<!-- https://evan-moon.github.io/2020/05/21/about-cors/#%EB%A7%88%EC%B9%98%EB%A9%B0 -->
<!-- AdsctractHandlerMappings.getHandler() -->
- CORS는 Cross-Origin Resource Sharing의 줄임말로 직역하면 교차(다른) 출처 리소스 공유하고 해석할 수 있다.
- 도메인 또는 포트가 다른 서버의 자원을 요청하는 메커니즘
- CORS는 추가 HTTP 헤더를 사용하여, 한 출처에서 실행 중인 웹 애플리케이션이 다른 출처의 선택한 자원에 접근할 수 있는 권한을 부여하도록 브라우저에 알려주는 체제
- CORS는 브라우저의 구현 스펙에 포함되는 정책이기 때문에, 브라우저를 통하지 않고 서버 간 통신을 할 때는 이 정책이 적용되지 않는다.

**출처<sup>Origin</sup>**
- 서버의 위치를 의미하는 URL들은 하나의 문자열 같아보여도 여러개의 구성요소로 이뤄져있다.
```
 https:// www.test.com /users ?sort=asc&page=1 #fee
|        |            |      |                |    |
 protocal     host      path    query string   fragment
```
- 여기서 출처는 Protocal과 Host 그리고 위의 예시에서 보이진 않지만 포트 번호까지 모두 합친것을 의미한다.
- 포트 번호의 경우 생략이 가능한데, 웹에서 사용하는 HTTP, HTTPS 프로토콜의 기본 포트 번호가 정해져있기 때문이다.
<!-- TODO -->
**SOP<sup>Same-Origin Policy</sup>**

**Spring CORS 설정**
<!-- https://dev-pengun.tistory.com/entry/Spring-Boot-CORS-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0 -->
- 

<a id="msa"></a>
# MSA vs Monolitic 장단점
<!-- daangn -->
<!-- https://m.blog.naver.com/tkdrns90/221986327039 -->
**MSA**
- 장점
  - 변경이 있는 서비스 부분만 따로 배포가 가능
  - 특정 서비스에 대해서만 확장이 가능
  - 협업시 비교적 적은 리스크로 프로젝트를 진행시킬 수 있다.
- 단점
  - 기본적으로 API 를 통해 각 서비스가 통신하므로 모놀리틱 아키텍처에 비해 응답 시간이 소요된다.
  - 중복 배치되는 모듈에 대해서 그만큼 메모리 사용량이 증가한다.
  - 문제가 발생했을 때 여러 시스템을 동시에 살펴봐야하기 때문에 프로젝트 테스트의 복잡성이 증가한다.

**Monoltic**
- 장점
  - 배포가 간편
  - 테스트의 편의성
  - 운영관리의 용이
- 단점
  - 규모가 커질수록 빌드 및 배포 시간이 길어진다.
  - 소수인원의 실수가 프로젝트에 치명적인 영향을 끼칠 수 있다.

</br>

# Spring 경량 컨테이너, IoC, POJO, DI, DL, AOP
<!-- daangn -->
<!-- https://velog.io/@ddh963963/spring-%EC%A3%BC%EC%9A%94%ED%8A%B9%EC%A7%95%EA%B3%BC-%EC%9A%A9%EC%96%B4%EC%A0%95%EB%A6%AC -->
![spring-1](https://user-images.githubusercontent.com/18159012/117638253-99ab2e80-b1bd-11eb-910f-c2d7decfd6da.jpg)

**경량 컨테이너**
- 스프링은 객체를 담고 있는 컨테이너로써 자바 객체의 생성과 소멸과 같은 라이프사이클을 관리하고, 언제든 필요한 객체를 가져다 사용할 수 있도록 한다.

**POJO<sup>Plain Old Java Object</sup> : 평범한 자바 객체** <sup>[link](#pojo)</sup>
<!-- https://limmmee.tistory.com/8 -->
<!-- http://asuraiv.blogspot.com/2017/07/spring-pojo.html -->
- 일반적인 자바 객체를 의미한다.
- 주로 특정 자바 모델이나 기능, 프레임워크를 따르지  않는 Java Object를 지칭한다.

**IoC<sup>Inversion of Control</sup> : 제어의 반전**
- 기존의 자바의 객체 생성 및 의존관계에 있어 모든 제어권을 개발자에게 있었지만, 스프링에서는 프로그램의 흐름을 프레임워크가 주도한다.
- 스프링 프레임워크에서 객체에 대한 생성과 생명주기를 관리할 수 있는 기능을 제공하고 있는데, 이런 이유로 스프링을 스프링 컨테이너 또는 IoC 컨테이너라고 부르기도 한다.  
- 제어권이 컨테이너로 넘어가게 되었고, 이것을 제어권의 흐름이 바뀌었다고 하여 IoC 라고 부른다.
- 제어권이 스프링에게 없다면 `@Autowired`와 같은 어노테이션으로 의존성 주입을 할 수 없게된다.

| | 기본 자바 | IoC |
| - | - | - |
| | 1. 객체 생성</br>2. 의존성 객체 생성 : 클래스 내부에서 생성<br/>3. 의존성 객체 메서드 호출 | 1. 객체생성</br>2.의존성 객체 주입 : 스스로 객체를 생성하지 않고 제어권을 스프링에 위임하여 스프링이 만들어 놓은 객체(빈)릏 주입한다.</br>3. 의존성 객체 메서드 호출 | 

**DI<sup>Dependency Injection</sup> : 의존성 주입** <sup>[link](#di)</sup>
- 객체간 의존관계를 객체 자신이 아닌 외부에서 생성한 후 주입시키는 방식
- DI를 통해 모듈간의 결합도가 낮아지고 유연성이 높아진다.
- 스프링 IoC의 핵심 개념이며, 스프링에서는 각 객체를 빈으로 관리한다.

**DL<sup>Dependency Lookup</sup> : 의존성 검색**
- 의존대상(빈)을 검색을 통해 반환받을 수 있다 : `factory.getBean(id)`

**AOP<sup>Aspect Oriented Programming</sup> : 관점 지향 프로그래밍**
<!-- https://jojoldu.tistory.com/71 -->
- 공통의 관심사랑을 적용하여 의존관계의 복잡성과 코드 중복을 해소하는것을 의미

<a id="pojo"></a>
# POJO vs JavaBean
**POJO**
- 일반적인 자바 객체를 의미한다.
- POJO가 JavaBean을 포함하는 더 큰 개념이다.
- 조건
  - 특정 규약에 종속되지 않는다.
  - 특정 환경에 종속되지 않는다.

**JavaBeans**
- JavaBean API Specification에 따른 Standard이다.
- 여러가지 오브젝트들을 하나의 오브젝트에 담기 위한 규직(소프트웨어 프로토콜)을 따른다.
- 조건
  - 모든 필드는 private이며, getter/setter메서드를 통해서만 접근이 가능하다. (for encapsulation)
  - Argument가 없는(no-argument) 생성자가 존재한다. (오브젝트 생성과 get/set을 편하게 하기 위해)
  - java.io.Serializable 인터페이스를 구현한다. (오브젝트를 담아 전송하거나 저장하기 위해)

| POJO | JAVA BEAN |
| - | - |
| Java laguage 에 의한 특별한 restrictions 이 없다. | POJO 보다 restrictions 이 많다. |
| Fields 에 대한 통제를 제공하지 않는다. | Fields에 대한 통제를 가진다. |
| SErializable 에 대한 interface 를 구현할 수 있다. | Serializable 에 대한 interface 를 구현해야만 한다. |
| Fields 는 이름으로 접근할 수 있다. | Fields 는 getter 와 setter 로만 접근할 수 있다. |
| Fields 에 대한 접근제어자 규칙이 자유롭다. | Fields 는 접근제어자를 private 로만 가질 수 있다. |
| constructor 에 argument를 가질 수 있다. | constructor 에 argument를 가질 수 없다. |
| member와 field에 대해 restriction 한 접근 규칙을 정하고 싶지 않을 때 사용된다. | member와 restriction 한 접근 규칙을 정하고자 할 때 사용된다. |

**Spring에서의 POJO**
- 스프링은 POJO를 이용한 엔터프라이즈 어플리케이션 개발을 목적으로 한다.
- 스프링의 핵심인 IoC, DI, AOP등을 POJO를 이용해서 유연하게 확장할 수 있도록 한다.

<a id="di"></a>
# 스프링 DI와 Reflection
<!-- https://kellis.tistory.com/70 -->

**Reflection**
- Reflection은 이처럼 클래스타입의 인스턴스를 생성하여 클래스의 필드, 생성자, 메서드, 상속된 부모들을 다룰 수 있다.

**주입 방식**
- 생성자 주입
  - 스프링 4.3 부터 단일 생성자의 경우 `@Autowired` 어노테이션이 불필요하다
- 필드 주입
- Setter 주입


**가장 좋은 방식은?**
<!-- https://webdevtechblog.com/%EC%8A%A4%ED%94%84%EB%A7%81-%EC%88%9C%ED%99%98-%EC%B0%B8%EC%A1%B0-circular-reference-d01c6beee7e6 -->
- 스프링 소스에선 생성자 주입을 사용한다.
- 생성자 주입의 장점
  - 테스트 작성시 리플렉션을 이용하지 않고 주입이 가능하다.
  - 객체 생성 시점에 순환 참조가 일어나기 때문에 다른 방식들과 달리 스프링 어플리케이션이 실행되지 않는다.
  - 의존성 주입이 필요한 필드를 final 로 선언하여 Immutable 하게 사용할 수 있다.
  - 의존관계가 설정되지 않으면 객체 생성이 불가능하기 때문에 NullPointError 를 방지할 수 있다.

**생성자 주입 방법**
```java
@Component
public class BeanA {
    private Properties properties;

    @Autowired
    public BeanA(Properties properties) {
        this.properties = properties;
    }
    ...
```
- `@Autowired` 어노테이션과 생성자의 파라메터로 등록할 경우 스프링이 주입 해준다.
```java
@Component
@RequiredArgsConstructor
public class BeanA {
    private final Properties properties;

    @Autowired
    public BeanA(Properties properties) {
        this.properties = properties;
    }
    ...
```
- Lombok을 사용하면 더 간편하게 생성자 주입을 사용할 수 있다.

# Spring Bean Lifecycle
<!-- https://sehun-kim.github.io/sehun/springbean-lifecycle/#4 -->
**생성**
```java
@Autowired
private Properties properties;

public BeanA() {} // 기본생성자
```
- 생성자를 호출하여 인스턴스를 만들어 Bean 등록

**초기화**
```java
// @Component를 사용할 경우
@PostConstruct
public void init() {
  System.out.println("init");
}

// @Bean을 사용할 경우 어노테이션에서 메서드를 명시
@Bean(initMethod = "init")
public BeanA beanA() {
  return new BeanA();
}
```

**소멸**
```java
// @Component를 사용할 경우
@PreDestroy
public void destroy() {
  System.out.println("destroy");
}

// @Bean을 사용할 경우 어노테이션에서 메서드를 명시
@Bean(destroyMethod = "destroy")
public BeanA beanA() {
  return new BeanA();
}
```

**동작**
- 각 Bean 객체들이 순서대로 [생성, 등록, 초기화] 되다가, 의존하고 있는 Bean을 가진 Bean이 초기화 될 때, 의존하는 Bean이 없는 경우 먼저 해당 Bean을 생성,초기화 해준다.
- 각 Bean 객체들이 초기화 된 순서의 역순으로 destroy()된다.

> **초기화 전에 빈 등록이 먼저 되는 이유**
> 초기화나 소멸 메서드는 모두 IoC 컨테이너에서 관리된다. 때문에 해당 메서드들을 호출하기 위해선 먼저 IoC 컨테이너에 빈을 등록해야한다.

# 스프링 서비스 추상화 : PSA<sup>Portable Service Abstraction</sup>
- 환경의 변화와 관계없이 일관된 방식의 기술로의 접근 환경을 제공하려는 추상화 구조를 말한다. 
  e.g. JPA의 구현체가 무엇이든 상관 없이 **동일한 인터페이스로 구동이 가능**하다.
- Spring 에서 동작할 수 있는 Library 들은 POJO 원칙을 지키게끔 PSA 형태의 추상화가 되어있음을 의미한다. 
- Spring 은 특정 기술에 직접적 영향을 받지 않게끔 객체를 POJO 기반으로 한번씩 더 추상화한 Layer 를 갖고 있으며 이를통해 일관성있는 서비스 추상화를 만들어낸다. 

# Spring MVC request 처리 과정
<!-- daangn -->
![spring-mvs-process-1](https://user-images.githubusercontent.com/18159012/117173061-593b6180-ae07-11eb-8b9c-8660289bb117.png)

# Spring filter, interceptor, AOP 차이점
<!-- daangn -->
<!-- https://yzlosmik.tistory.com/24 -->
<!-- https://goddaehee.tistory.com/154 -->
스프링에서 request의 실행순서는 Filter - Dispatcher - Interceptor - AOP - Controller 순으로 실행된다.

**Filter**
- dispatcher 이전에 실행된다.
- 요청이나 응답에 대한 변경 처리가 가능하다.
- 스프링 컨텍스트 외부에 존배하여 스프링과 무관한 자원에 대해서 동작한다.
- 일반적으로 인코딩, [CORS](#cors), XSS, LOG, 인증, 권한 등의 요청에 대한 처리에 사용된다.

**Interceptor**
<!-- https://velog.io/@ette9844/Spring-HandlerInterceptor-%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%B2%98%EB%A6%AC -->
- dispatcher 이후에 실행된다.
- 스프링에서 관리되어 스프링 내의 객체(빈)에 대해서 접근이 가능하다.
- 인터셉터를 구현하기 위해 `HandlerInterceptor` 인터페이스나 `HandlerInterceptorAdaptor` 추상 클래스를 상속받는다. 
- 일반적으로 로그인처리에서 많이 사용되는데, 인터셉터를 사용하지 않고 로그인 처리를 하기 위해선 Controller의 핸들러 메서드 마다 세션을 확인하려 로그인 정보를 확인하는 코드를 중복으로 작성해야 한다.

**AOP**
- OOP를 보완하기 위해 종단면 관점으로 중복된 코드를 줄일 때 사용한다.
- Filter와 Interceptor와 달리 메서드 전/후 지점에 자유롭게 설정이 가능하다.
- Filter와 Interceptor는 주소로 대상을 구분해서 걸러내야하는 반면, AOP는 주소, 파라미터, 애노테이션 등 다양한 방법으로 대상을 지정할 수 있다.
- AOP의 포인트 컷
  - `@Before` : 대상 메서드의 수행 전
  - `@After` : 대상 메서드의 수행 후
  - `@AfterReturning` : 대상 메서드의 정상적인 수행 후
  - `@AfterThrowing` : 예외 발생 후
  - `@Around`: 대상 메서드의 수행 전/후

# Spring Bean Scope
<!-- daangn -->
빈 팩토리에서 관리
**Singleton**
- ConfigurableBeanFactory.SCOPE_SINGLETON
- Spring 컨테이너에 의해 한 번만 생성된다.
- 컨테이너가 사라질 때 함께 빈도 제거된다.
- 기본 스코프

**Prototype**
- ConfigurableBeanFactory.SCOPE_PROTOTYPE
- 모든 요청(getBean()이 호출될 때)에서 새로운 객체를 생성된다.

커스텀 스코프
**Request**
- WebApplicationContext.SCOPE_REQUEST
- 커스텀 스코프로 해당 빈은 request의 attribute로 관리한다.
- HTTP 요청별로 인스턴스화 되며 요청이 끝나면 소멸

**Session**
- WebApplicationContext.SCOPE_SESSION
- 커스텀 스코프로 해당 빈은 session의 attribute로 관리한다.
- HTTP 세션별로 인스턴스화되며 세션이 끝나며 소멸

**Application**
- 웹의 서블릿 컨텍스트와 같은 범위로 유지되는 스코프
- 커스텀 스코프로 해당 빈은 servlet context의 attribute로 관리한다.
- Singleton과 비슷해보이지만 두가지 차이점이 존재한다.
  - Application Scope는 서블릿 컨텍스트 단위로 싱글톤을 관리하지만, Singleton Scope은 어플리케이션 컨텍스트 단위로 싱글톤을 관리한다. 한 어플리케이션 내에서 여러개의 어플리케이션 컨텍스트가 존재할 수 있다.
  - Application Scope 빈은 서블릿 `ServletContext`의 attribute로 접근이 가능하다.

Global Session
- 웹의 포틀릿 컨텍스트와 같은 범위로 유지되는 스코프

> 포틀릿 웹 응용 프로그램  
> 서블릿 기반의 앱에선 한 요청에 대해 응답을 하는 것에 반해, 포틀릿에선 랜더와 요청, 두가지에 대한 응답을 한다.

# 싱글톤과 statis class 차이
**싱글톤**
- 클래스가 사용될 때에 새로운 객체를 생성하는 것이 아니라, 동일 객체를 사용
- 초기화가 간단함 -> 생성자
- 편리하지만, 많이 사용될 경우 독립성을 확인하기 어려움

**Static Class**
- 클래스의 객체를 만들 필요 없이, static 한 클래스에 접근하여 사용
- 초기화가 어려움

# Spring Application Context vs Servlet Context
**Application Context**
- Web Application 최상단에 위치하고 있는 Context
- Spring에서 ApplicationContext란 BeanFactory를 상속받고 있는 Context
- Spring에서 root-context.xml, applicationContext.xml 파일은 ApplicationContext 생성 시 필요한 설정정보를 담은 파일 (Bean 선언 등..)
- Spring에서 생성되는 Bean에 대한 IoC Container (또는 Bean Container)
- 특정 Servlet설정과 관계 없는 설정을 한다 (@Service, @Repository, @Configuration, @Component)
- 서로 다른 여러 Servlet에서 공통적으로 공유해서 사용할 수 있는 Bean을 선언한다.
- Application Context에 정의된 Bean은 Servlet Context에 정의 된 Bean을 사용할 수 없다.

**Servlet Context**
- Servlet 단위로 생성되는 context
- Spring에서 servlet-context.xml 파일은 DispatcherServlet 생성 시에 필요한 설정 정보를 담은 파일 (Interceptor, Bean생성, ViewResolver등..)
- URL설정이 있는 Bean을 생성 (@Controller, Interceptor)
- Application Context를 자신의 부모 Context로 사용한다.
- Application Context와 Servlet Context에 같은 id로 된 Bean이 등록 되는 경우, Servlet Context에 선언된 Bean을 사용한다.
- Bean 찾는 순서
  - Servlet Context에서 먼저 찾는다.
  - 만약 Servlet Context에서 bean을 못찾는 경우 Application Context에 정의된 bean을 찾는다.
- Servlet Context에 정의된 Bean은 Application Context의 Bean을 사용할 수 있다.

# Spring @Bean vs @Component
<!-- daangn -->
**@Bean**
- 메서드에만 사용할 수 있다.
- 외부 라이브러리를 빈으로 등록하고 싶은 경우 사용한다.

**@Component**
- 클래스에만 사용할 수 있다.
- 개발자가 직접 컨트롤리 가능한 클래스에서 사용할 수 있다.

# Spring Webflux 요청이 처리되는 과정
![spring-webflux-0](https://user-images.githubusercontent.com/18159012/116578105-09165800-a94c-11eb-9ca6-eb320be1abec.png)

# Multiplex Server의 동작
<!-- TODO -->

</br>

# Spring Framework vs Spring Boot
<!-- daangn -->
<!-- https://ooeunz.tistory.com/56 -->
**Spring Framework**
- EJB를 대체하는 프레임워크로 경량 컨테이너, IoC, DI, AOP의 장점을 지니고 있다.
- "스프링의 설정이 반이다." 라는 말이 있을 정도로 설정하는 것에 어려움이 있다.

**Spring Boot**
- Spring Boot는 환경 설정을 최소화하여 개발자가 비즈니스 로직에 집중할 수 있도록 도와 생산성을 크게 향상 시킨다.
- spring boot starter를 통해 대부분의 dependency를 관리하여 dependency의 버전 관리를 도와준다.
- Embeded Tomcat을 사용하기 때문에 톰캣을 설치하거나 버전을 따로 관리할 필요가 없다.

## Spring Boot Starter
<!-- http://dveamer.github.io/backend/SpringBootStater.html -->
- Spring Boot의 spring-boot-starter란 의존성과 설정을 자동화해주는 모듈을 말한다.
- spring-boot-starter-parent 를 설정했다면 버전 태그는 필요없다.

## Spring Boot Starter Parent
- spring-boot-starter가 의존성 조합을 제공한다면, starter-parent는 의존성 조합간의 충돌 문제가 없는 검증 된 버전 정보 조합을 제공한다.
- 버전을 오버라이딩하기 위해선 dependency 내부에서 다른 버전을 지정하여 사용하면 된다.

<a id="java"></a>
# 객체지향의 특징
**캡슐화**
- 객체의 상세한 내용을 외부에 철저히 숨기고 메시지만으로 객체와의 상호작용을 하게 함 (=정보은닉)

**상속성**
- 클래스의 속성과 메소드를 하위 클래스에 물려주거나, 상위 클래스에서 물려받는 것을 지칭

**추상화**
- 객체에서 공통된 속성과 메소드를 추출하는 것

**다형성**
- 하나의 클래스 내부에 같은 이름의 메소드를 여러 개 정의하거나, 상위 클래스의 메소드를 하위 클래스에서 다시 정의하여 사용할 수 있음

# generic 이란?
- 각 데이터 형에 대한 별도의 메소드나 멤버변수를 구현하지 않고, 미리 정의된 하나의 메소드 또는 매개변수에 서로 다른 자료형의 결과를 얻을 수 있도록 하는 기능
- 기능은 같지만 자료형만 서로 다른 경우에 쓰임 (콜렉션에서 많이 사용)

# overloading과 overriding의 차이
**Overloading**
- 클래스 내부에 동일한 이름의 메소드를 정의하는 것

**Overriding**
- 상속받은 자료나 메소드를 그대로 사용하지 않고 자신이 새로 만들어 사용하는 것

# 접근 제한자
**public**
- 접근 제한 없음

**protected**
- 같은 또는 다른 패키지에서 상속받아 접근 가능

**default**
- 같은 패키지 내에서 상속받아 접근 가능

**private**
- 같은 클래스 내에서 접근 가능

# 키워드 final
- 클래스 : 상속되지 않음
- 메서드 : overriding 되지 않음
- 변수 : 값이 변경되지 않음

# 키워드 static
- 클래스 : 객체를 생성하지 않고 메서드나 변수에 접근이 가능 → 객체 생성도 가능하지만 쓸모없음
- 메서드 : 객체에 의존적이지 않은 작업을 수행 → 멤버변수 사용 불가
- 변수 : 객체와 관계 없이 클래스당 하나만 존재

# Java equals() vs hashcode()
<!-- daangn -->
**equals()**
- 두 객체가 동일한지 검사하기 위해 사용
- 기본적으로 2개의 객체가 가리키는 곳이 동일한 메모리 주소일 경우에만 동일한 객체가 된다

**hashcode()**
- 기본적으로 Object 클래스에 의해 저장된 객체의 메모리 주소를 반환한다.

**둘의 관계**
- Java 프로그램을 실행하는 동안 equals에 사용된 정보가 수정되지 않았다면, hashCode는 항상 동일한 정수값을 반환해야 한다. (Java의 프로그램을 실행할 때 마다 달라지는 것은 상관이 없다.)
- 두 객체가 equals()에 의해 동일하다면, 두 객체의 hashCode() 값도 일치해야 한다.
- 두 객체가 equals()에 의해 동일하지 않다면, 두 객체의 hashCode() 값은 일치하지 않아도 된다.

## equals()를 재정의 해야할때
- 논리적 동치성을 확인해야 하는데 상위 클래스의 equals가 논리적 동치성을 비교하도록 재정의 되어있지 않을때
- 주로 값 클래스 : Integer, String처럼 값을 표현하는 클래스
- 두 값 객체를 equals로 비교한다는 것은 객체가 같은지가 아니라 값이 같은지 알고 싶은 것이다.
- equals가 논리적 동치성을 확인하도록 재정의 해두면, 그 인스턴스 값의 비교가 가능하고 Map의 key와 Set의 원소로 사용할 수 있다.

## Equals 메서드 규약 (null이 아닌 모든 참조값 x,y,z에 대해)
- 반사성(reflexivity) : `x.equals(x)`는 true
- 대칭성(symmetry) : `x.equals(y)`가 true이면 `y.equals(x)`도 true
- 추이성(transitivity) : `x.equals(y)`는 true이고 `y.equals(z)`는 true이면 `x.equals(z)`는 true
- 일관성(consistency) : `x.equals(y)`를 반복해서 호출해도 항상 true 또는 false를 반환
- null-아님 : `x.equals(null)`는 false

## hashcode()를 재정의 하지 않을 때 발생하는 문제점
- 같은 값을 가진 객체가 서로 다른 해시값을 갖게 될 수 있다.
- 특히 HashMap의 key 값으로 해당 객체를 사용할 경우 문제가 발생한다.

# StringBuilder를 사용해야하는 이유
- String 객체와 다른 String 객체를 더할 때 새로운 String 객체가 만들어지면서 메모리 할당하게 되어 쓰레기 값을 생성하게 된다.
- JDK 1.5 이상부턴 String의 `+` 오퍼레이터를 사용하면 StringBuilder를 사용한 코드로 바꿔주지만, 각 줄마다 StringBuilder를 생성하기 때문에 주의해야한다.
- 한줄에서 상수 String을 더하는 것은 모두 합쳐진 문자열로 바꿔준다. `String a = "1" + "2" + "3";` -> `String a = "123";`
- 한줄에서 String과 상수를 더하면 StringBuffer의 append, toString 메서드를 사용하는 코드로 바꿔준다. `String a = "a" + 4 + "c";` -> `String a = new StringBuffer().append("a").append(4).append("c").toString()`

# interface와 adstract class의 차이
**Interface**
- 추상 메서드와 상수만을 갖는 일종의 추상 클래스  
- 자바에서 지원하지 않는 다중 상속을 할 때 사용됨  
- Java 8 부터 default method와 static method가 추가될 수 있게 변경되었다. 

**Abstract Class**
- 추상 메서드를 하나 이상 갖는 클래스  
- 자신의 생성자로 객체 생성 불가능  

# Primitive Type과 Reference Type의 차이
**Primitive Type**
- 자바 기본형으로 변수에 값 자체를 저장
- byte, short, int, float, double, char, boolean

**Reference Type**
- 메모리상의 객체가 있는 위치를 저장

# Call by reference와 Call by value의 차이
**Call by Reference**
- 매개 변수의 원래 주소에 값을 저장하는 방식

**Call by Value**
- 주어진 값을 복사하여 처리하는 방식

</br>

<a id="jvm"></a>
# JVM
<!-- https://hoonmaro.tistory.com/19 -->
**JVM의 기능**
- 어느 운영체제 상에서도 실행될 수 있게 하는것 (한 번 작성해, 어디에서나 실행한다)
- 프로그램 메모리를 관리하고 최적화 하는 것

**JVM의 구조**
![jvm-structure-1](https://user-images.githubusercontent.com/18159012/117658166-62e11280-b1d5-11eb-8823-f235685a9e31.jpg)

- Class Loader : 런타임시 동적으로 JVM 내로 클래스를 로드한다.
- Execution Engine : Class Loader를 통해 JVM의 런타임 영역에 배치된 바이트 코드를 명령어 단위로 읽어서 싱핸한다.
- Garbage Collector : JVM 내의 메모리 관리 기능을 자동으로 수핸한다.
- Runtime Data Area : JVM이 운영체제 위에서 실행되면서 할당받는 메모리 영역이다. Class Loader에서 준비한 데이터들을 보관하는 장소이다.

# JIT 컴파일러
- 자바 코드가 자바 바이트 코드(.class)로 컴파일된 후 가상 머신에서 기계어로 해석하여 코드를 인터프리터 형식으로 실행한다.
- 자바 바이트 코드 한줄을 해석하고 실행하는 방식은 기계어로 컴파일 되는 C/C++ 과 같은 언어보다 느리기 때문에 JIT 컴파일러가 이를 보완하기 위해 존재한다.
- JIT 컴파일러는 런타임중에 가상 기계에서만 돌아가는 자바 바이트 코드를 해당 플랫폼에 맞는 기계어로 컴파일한다.
- 기계어로 컴파일된 코드는 인터프리터가 자바 바이트 코드에서 다시 번역하지 않고 바로 실행된다.

# JVM 메모리<sup>Runtime Data Area</sup>
![jvm-runtime-data-areas-1](https://user-images.githubusercontent.com/18159012/117649570-a3875e80-b1ca-11eb-80ca-07e1ec4bf479.jpg)
 - Method Area: 클래스, 변수, Method, static변수, 상수 정보 등이 저장되는 영역 (모든 Thread가 공유)
 - Heap Area: new 명령어로 생성된 인스턴스와 객체가 저장되는 구역 (GC 이슈는 이 영역에서 일어나며, 모든 Thread가 공유)
 - Stack Area: Method 내에서 사용되는 값들(매개변수, 지역변수, 리턴값 등)이 저장되는 구역으로 메소드가 호출될때 LIFO로 하나씩 생성되고, 메소드 실행이 완료되면 LIFO로 하나씩 지워진다.
 - PC Register: CPU의 Register와 역할이 비슷하다. 현재 수행중인 JVM 명령의 주소값이 저장된다.
 - Native Method Stack: 다른 언어(C/C++ 등)의 메소드 호출을 위해 할당되는 구역으로 언어에 맞게 Stack이 형성되는 구역이다.

![jvm-runtime-data-areas-2](https://user-images.githubusercontent.com/18159012/117657191-3c6ea780-b1d4-11eb-8cda-5d5a532245c0.jpg)

- Code Cache : JIT에 의해 bytecode로 전환되어 저장되어 있는 코드
- Interned String : String이 사용될 때 JVM 해당 메모리를 string pool에 저장하여 String에 의해 메모리가 많이 사용되는 것을 막는다.

# JVM의 Heap vs Non-heap
**Java 8 전**
```
Java7
<----- Java Heap ----->             <- Native(OS) Memory -->
+------+----+----+-----+-----------+--------+--------------+
| Eden | S0 | S1 | Old | Permanent | C Heap | Thread Stack |
+------+----+----+-----+-----------+--------+--------------+
                        <--------->
                       Permanent Heap
S0: Survivor 0
S1: Survivor 1
```
- Heap
  - 모든 클래스 인스턴스의 메모리가 적재되는 공간.
- Native Memory
  - Native Code로 시스템 콜을 호출하고 OS가 메모리를 어플리케이션에 할당하는 공간.
    - C Heap : jdk내부적으로 C라이브러리를 사용하거나 jni를 통해서 c프로그램을 호출할 시 Data 영역을 사용
    - Thread Stack : 각 스레드 고유의 메모리 공간
- Permanent Heap
  - Class의 Meta정보, Method의 Meta정보, Static 변수와 상수 정보(메모리 포함)를 저장하는 공간.
  - 런타임에서 크기의 수정이 불가능 하여, PermGen 설정으로 적절한 크기를 설정해야했다.
<!-- https://stackoverflow.com/questions/50163218/is-method-area-still-present-in-java-8 -->

**Java 8 이후**
```
Java 8
<----- Java Heap -----> <------- Native(OS) Memory -------->
+------+----+----+-----+-----------+--------+--------------+
| Eden | S0 | S1 | Old | Metaspace | C Heap | Thread Stack |
+------+----+----+-----+-----------+--------+--------------+
S0: Survivor 0
S1: Survivor 1
```
- Heap : Java 8 전과 동일
- Native Memory : Java 8 전과 동일
- Metaspace
  - Heap 영역에 메타 정보가와 상수 정보를 모두 Heap(Permanant)에 저장되던 것을 메타 정보를 위한 공간으로 분리했다.
  - 상수는 실제론 Heap에 적재되고, Metaspace에선 Heap에 적재된 주소값만 가진다.

**JVM 메모리 옵션**
![jvm-options-1](https://user-images.githubusercontent.com/18159012/117740907-6065d380-b23c-11eb-97ce-44ab40857ace.jpg)


<a id="GC"></a>
# GC란?
- 힙 영역에서 가비지를 찾아내 힙의 메모리를 회수하는 것 
- GC 대상인 객체를 처리하여 메모리를 회수하는 작업은 즉각적인 연속 작업이 아니며, GC 대상 객체의 메모리를 한 번에 모두 회수하지도 않는다
- 실행중인 JVM 내부에서 GC 프로세스를 통해 메모리를 관리한다.
<!-- ### Reachability
- reachable : 어떤 객체에 유효한 참조가 있는 경우
- unreachable : 어떤 객체에 유효한 참조가 없는 경우 → 가비지로 간주해 GC를 수행함

### 객체참조방식
- strong reference
- soft reference
- weak reference
- phantom reference

### 힙 내의 참조 4가지
- 힙 내의 다른 객체에 의한 참조
- Java 스택, 즉 Java 메서드 실행 시에 사용하는 지역 변수와 파라미터들에 의한 참조
- 네이티브 스택, 즉 JNI(Java Native Interface)에 의해 생성된 객체에 대한 참조
- 메서드 영역의 정적 변수에 의한 참조

### Root set
- 객체들이 참조 사슬을 이루는 상황에서 유효한 참조 여부를 파악하기 위한 최초의 참조
- 힙 내의 다른 객체에 의한 참조를 제외한 나머지 3개가 root set이 되서 reachability를 판가름하는 기준이 됨

### Strong Reference
- Root set에서 시작한 참조 사슬에 속하는 레퍼런스
- strong reachable 객체

### Weak Reference
- Weak reference 객체 자체는 strong reachable 객체이다
- Weak reference로만 참조된 객체는 weakly reachable 객체라고 하며 GC가 동작할 때 unreachable과 함께 처리된다

### Soft Reference
- SoftReferencce 객체로만 참조된 객체는 힙에 남아 있는 메모리의 크기와 해당 객체의 사용 빈도에 따라 GC 여부가 결정
- softly reachable 객체는 weakly reachable 객체와는 달리 GC가 동작할 때마다 회수되지 않으며 자주 사용될수록 더 오래 살아남게 됨

### PhantomReference
- PhantomReference로만 참조되는 객체는 먼저 파이널라이즈된 이후에 phantomly reachable로 간주됨
- 객체에 대한 참조가 PhantomReference만 남게 되면 해당 객체는 바로 파이널라이즈됨

### Strengths of Reachable
- strongly reachable: root set으로부터 시작해서 어떤 reference object도 중간에 끼지 않은 상태로 참조 가능한 객체, 다시 말해, 객체까지 도달하는 여러 참조 사슬 중 reference object가 없는 사슬이 하나라도 있는 객체
- softly reachable: strongly reachable 객체가 아닌 객체 중에서 weak reference, phantom reference 없이 soft reference만 통과하는 참조 사슬이 하나라도 있는 객체
- weakly reachable: strongly reachable 객체도 softly reachable 객체도 아닌 객체 중에서, phantom reference 없이 weak reference만 통과하는 참조 사슬이 하나라도 있는 객체
- phantomly reachable: strongly reachable 객체, softly reachable 객체, weakly reachable 객체 모두 해당되지 않는 객체. 이 객체는 파이널라이즈(finalize)되었지만 아직 메모리가 회수되지 않은 상태이다.
unreachable: root set으로부터 시작되는 참조 사슬로 참조되지 않는 객체 -->

## GC의 객체 처리순서
https://lazymankook.tistory.com/83
https://mirinae312.github.io/develop/2018/06/04/jvm_gc.html

# Serial GC
- Mark-Sweep-Compaction 알고리즘을 통해 단일 스레드에서 순차적으로 동작
Mark-Sweep-Compaction 알고리즘
  - 사용되지 않는 객체를 식별하는 작업 (Mark)
  - 사용되지 않는 객체를 제거하는 작업 (Sweep)
  - 파편화된 메모리 영역을 앞에서부터 채워나가는 작업 (Compaction)

# Parallel GC (Java 8, 7)
- GC를 멀티스레드로 실행
- Strop the world 시간이 줄어듬

# G1GC (Java 9 이후 deafult 7에 추가)
<!-- daangn -->
- 하드웨어가 발전하면서 메모리의 크기가 커졌지만 기존 GC 알고리즘으로 큰 메모리에서 좋은 성능을 내지 못해 등장
  => 큰 메모리에서 짧은 GC 시간 (stop-the-world)를 보장
- G1 GC는 바둑판의 각 영역에 객체를 할당하고 GC를 실행한다. 그러다가, 해당 영역이 꽉 차면 다른 영역에서 객체를 할당하고 GC를 실행한다. 즉, 지금까지 설명한 Young의 세가지 영역에서 데이터가 Old 영역으로 이동하는 단계가 사라진 GC 방식이라고 이해하면 된다. 
- Eden, Survivor, Old 영역이 존재하지만 고정된 크기고 고정된 위치에 존재하지 않고 힙 메모리 영역을 Region이라는 특정한 크기고 나눠 Region의 상태에 따라 역할(Eden, Survivor, Old, Humongous, Available/Unused)이 동적으로 부여된다.
- JVM 힙은 2048개의 Region 으로 나뉠 수 있으며, 각 Region의 크기는 1MB ~ 32MB 사이로 지정될 수 있다. (-XX:G1HeapRegionSize 로 설정)
  Humongous
  - Region 크기의 50%를 초과하는 큰 객체를 저장하기 위한 공간이며, 이 Region 에서는 GC 동작이 최적으로 동작하지 않는다.

  Available/Unused
  - 아직 사용되지 않은 Region을 의미한다.

### G1 Young GC
- G1 GC에서 Young GC 를 수행할 때는 STW(Stop-The-World) 현상이 발생하며, STW 시간을 최대한 줄이기 위해 멀티스레드로 GC를 수행한다.
- Young GC는 각 Region 중 GC대상 객체가 가장 많은 Region(Eden 또는 Survivor 역할) 에서 수행 되며, 이 Region 에서 살아남은 객체를 다른 Region(Survivor 역할) 으로 옮긴 후, 비워진 Region을 사용가능한 Region으로 돌리는 형태 로 동작한다.

### G1 Full GC
- Full GC 가 수행될 때는 Initial Mark -> Root Region Scan -> Concurrent Mark -> Remark -> Cleanup -> Copy 단계를 거치게된다.

**Initial Mark**
- Old Region 에 존재하는 객체들이 참조하는 Survivor Region 을 찾는다. 이 과정에서는 STW 현상이 발생하게 된ㄷ.

**Root Region Scan**
- Initial Mark 에서 찾은 Survivor Region에 대한 GC 대상 객체 스캔 작업을 진행한다.

**Concurrent Mark**
- 전체 힙의 Region에 대해 스캔 작업을 진행하며, GC 대상 객체가 발견되지 않은 Region 은 이후 단계를 처리하는데 제외되도록 한다.

**Remark**
- 애플리케이션을 멈추고(STW) 최종적으로 GC 대상에서 제외될 객체(살아남을 객체)를 식별해낸다.

**Cleanup**
- 애플리케이션을 멈추고(STW) 살아있는 객체가 가장 적은 Region 에 대한 미사용 객체 제거 수행한다. 이후 STW를 끝내고, 앞선 GC 과정에서 완전히 비워진 Region 을 Freelist에 추가하여 재사용될 수 있게 한다.

**Copy**
- GC 대상 Region이었지만 Cleanup 과정에서 완전히 비워지지 않은 Region의 살아남은 객체들을 새로운(Available/Unused) Region 에 복사하여 Compaction 작업을 수행한다.

<!-- TODO: Add G1GC process image -->

<a id="jpa"></a>
# JPA 기본 생성자가 필요한 이유
<!-- https://goodyhlee.wordpress.com/2016/06/20/177/ -->
- 하이버네이트 등의 프레임워크에서 리플렉션을 이용해 엔티티를 생성할 때 기본 생성자가 필요한데, 개발자가 생성자를 따로 정의하여 사용하는 경우 기본 생성자를 사용할 수 없게 된다.
- id와 같은 필요한 생성자를 개발자가 재정의 하더라도 `@PersistenceConstructor` 어노테이션을 생성에자 붙이면 굳이 비어있는 생성자를 따로 작성하지 않아도 된다.

# N+1 문제
<!-- https://joosjuliet.github.io/n+1/ -->

# JPA persistence context
<!-- https://stackoverflow.com/questions/23984968/jpa-without-transaction -->
- 영속성 컨텍스트와 식별자 값
  - 엔티티를 식별자 값(@id로 테이블의 기본 키와 매핑한 값)으로 구분
  - 영속 상태는 식별자 값이 반드시 있어야 한다.
  - 식별자 값이 없으면 예외 발생.
- 영속성 컨텍스트와 데이터베이스 저장
  - JPA는 보통 트랜잭션을 커밋하는 순간 영속성 컨텍스트에 새로 저장된 엔티티를 데이터베이스에 반영
  - 플러시(flush)
- 영속성 컨텍스트가 엔티티를 관리하는 것의 장점
  - 1차 캐시
  - 동일성 보장
  - 트랜잭션을 지원하는 쓰기 지연
  - 변경 감지
  - 지연 로딩

<!-- https://ultrakain.gitbooks.io/jpa/content/chapter3/chapter3.4.html -->
**엔티티 조회**
- 영속성 컨텍스트는 내부에 캐시를 가지고 있음 => 1차 캐시
- 영속 상태의 엔티티는 모두 이곳에 저장
- 1차 캐시의 엔티티가 없는 경우 데이터베이스를 조회해서 엔티티를 영속성 컨텍스트에 생성

**엔티티 등록**
- 엔티티 매니저는 데이터 변경 시 트랜잭션을 시작해야 한다.
- 트랜잭션 시작 -> persist() -> commit() -> 트랜잭션 종료 순으 동작

**엔티티 수정**
- 트랜잭션 커밋 -> 엔티티 매니저 내부에서 먼저 플러시 호출
- 엔티티와 스냅샷을 비교해서 변경된 엔티티 찾는다.
- 변경된 엔티티가 있으면 수정 쿼리를 생성해서 쓰기 지연 SQL 저장소로 보낸다.
- 쓰기 지연 저장소의 SQL을 데이터베이스로 보낸다.
- 데이터베이스 트랜잭션을 커밋

## Transaction Persistence Context vs Extended Persistence Context
<!-- https://www.baeldung.com/jpa-hibernate-persistence-context -->
**Transaction Persistence Context**  
- 메서드가 트랜젝션 스코프에서 호출될 때, 트랜잭션이 실행되며 새로운 persistence context를 생성한다. 이후 트랜잭션이 종료될 때 persistence context가 닫히고 엔티티의 persist 상태가 종료된다.
<!-- In short: When a method on a transaction-scoped bean is called, a transaction will automatically be started by the container and a new persistence context will be created for you. When the method ends the transactions ends and the persistence context will be closed, your entities will become detached. -->

- Benefit: This behaviour is stateless, doesn't need much maintenance in the code by you and makes your EntityManager threadsafe.

**Extended Persistence Context**  
- 여러 트랙젝션들 에서도 하나의 persistence context를 사용할 수 있다. 이는 여러 메서드에서 동일한 persistence context를 공유할 수 있는 것을 의미한다.
<!-- In short: Can be used for a stateful session bean only and is tied to the lifecycle of the bean. The persistence context can spawn accross multiple transactions, which means the methods in your extended bean share the same persistence context. -->

- Benefit: Perfect to implement a conversation style interaction with clients. Your client call several bean methods to tell your bean all the information you need to know and at the end of the conversation you persist everything to your DB.

## QueryDSL
<!-- https://ict-nroo.tistory.com/117 -->
<!-- TODO -->

## DBCP<sup>DB 커넥션 풀<sup>
```java
Connection conn = null;
PreparedStatement  pstmt = null;
ResultSet rs = null;

try {
    sql = "SELECT * FROM A"

    // 1. 드라이버 연결 DB 커넥션 객체를 얻음
    connection = DriverManager.getConnection(DBURL, DBUSER, DBPASSWORD);

    // 2. 쿼리 수행을 위한 PreparedStatement 객체 생성
    pstmt = conn.createStatement();

    // 3. executeQuery: 쿼리 실행 후
    // ResultSet: DB 레코드 ResultSet에 객체에 담김
    rs = pstmt.executeQuery(sql);
    } catch (Exception e) {
    } finally {
        conn.close();
        pstmt.close();
        rs.close();
    }
}
```

- 다음의 코드에서 매번 커넥션 객체를 생성하고 사용후에 종료하는 방식은 비효율 적이기 때문에 커넥션 풀을 만들어 사용한 다음 풀링하여 사용하도록 한다.

# JPA save() vs saveAndFlush()
<!-- https://happyer16.tistory.com/entry/Spring-jpa-save-saveAndFlush-%EC%A0%9C%EB%8C%80%EB%A1%9C-%EC%95%8C%EA%B3%A0-%EC%93%B0%EA%B8%B0 -->
<!-- https://ramees.tistory.com/36 -->

<a id="cache"></a>
# Cache
한번 읽은(처리한) 데이타를 임시로 저장하고 필요에 따라 전송,갱신,삭제하는 기술로
보통은 데이타의 보관장소로 서버의 메모리를 사용하는 경우가 많다

**캐시의 대상이 되는 정보들**
- 단순하거나 단순한 구조의 정보
- 반복적으로 동일하게 제공되는 정보
- 정보의 변경주기가 빈번하지 않고 단위처리의 시간이 오래걸리는 정보
- 정보의 최신화가 반드시 실시간으로 이뤄지지 않아도 되는 정보

**캐싱 전략 : 캐시 사용시 유의해야할 것**
- 캐싱할 정보의 선택
- 캐싱할 정보의 유효기간
- 캐싱한 정보의 갱신시점

# 레디스 캐시 vs In memcache
<!-- https://hyuntaeknote.tistory.com/8 -->
**memcache**
- 데이터 형식으로 문자열만 지원한다.
- 작고 변하지 않는 데이타 예를들어 HTML 코드의 부분을 캐싱할때 내부 메모리 관리가 Redis 만큼 복잡하지 않아 능률적이기 떄문에 Memcached 는 메타 데이타에 있어 비교적 작은 메모리를 사용한다.
- 모든 key-value 쌍을 메모리에만 저장하므로 서버 장애시 데이터가 모두 손실된다.
- Replication을 지원하지 않는다. (다른 솔루션을 통해 적용은 할 수 있다.)

**레디스**
<!-- https://kimdubi.github.io/nosql/redis_persistent/ -->
- 모든 데이터를 메모리에 저장하고 조회한다.
- 다른 인메모리 솔루션과 달리 다양한 자료구조를 지원한다.
- 자체에서 Replication을 지원하기 때문에 장애가 발생하더라도 Slave 서버를 Master로 승격시켜 서비스 중단 없이 운영할 수 있다.
- AOF<sup>Append Only File</sup> 혹은 RDB<sup>Redis Database</sup> 통해 영속성을 지원한다.
  - AOF : 명령이 실행될 떄 마다 파일(ex. appendonly.aof)에 기록한다.
    - 서버 장애가 발생하더라도 데이터 유실이 거의 없다.
    - 텍스트 파일로 제공되어 쉽게 복구가 가능하다.
    - 모든 명령을 저장하기 때문에 파일이 크고, 로딩이 느리며, OS 파일 크기 제한으로 장애가 발생할 수 있다.
  - RDB : 특정한 간격으로 메모리에 있는 레디스 데이터 전체를 disk레 바이너리 형태로 기록한다.
    - AOF 보다 size 가 작고, 로딩 속도가 빠르다.
    - 바이너리 파일로 제공되어 손상이 발생했을 때 식별이 어렵다.
    - 서버장애 시점에 따라 데이터가 유실될 수 있다.

# 스프링 Redis 어노테이션
<!-- https://daddyprogrammer.org/post/3217/redis-springboot2-spring-data-redis-cacheable-cacheput-cacheevict/ -->
**`@Cacheable`**
- 저장된 캐시가 있는 경우 캐시를 반환하고, 없으면 리턴값을 Redis에 캐시한다.

**`@CachePut`**
- 저장된 캐시 정보를 갱신한다.
- 저장된 캐시가 없는 경우 생성한다.

**`@CacheEvict`**
- 저장된 캐시를 삭제한다.

**`@RedisHash`**
- Redis를 통해 JPA의 엔티티를 사용하는 것처럼 만들어주는 어노테이션
<!--  -->
<!-- TODO -->

<a id="distributed-lock"></a>
# Redis Distributed Lock
<!-- toss -->
<!-- https://sg-choi.tistory.com/292 -->
- 여러 독립된 프로세스에서 하나의 자원을 공유해야 할 때, 데이터에 결함이 발생하지 않도록 하기 위해서 distributed lock을 활용할 수 있다.
- redis에서는 분산 락을 구현한 알고리즘으로 redlock이라는 것을 제공하고 있는데, 자바에서의 redlock 구현체는 redisson이라고 한다.

**Redission**
<!-- https://github.com/redisson/redisson/wiki/8.-distributed-locks-and-synchronizers -->
<!-- https://redis.io/topics/distlock -->
- Redission은 레디스 서버를 사용하여 `RLock` 객체를 얻고 `lock.tryLock()`을 통해 타임아웃등을 설정하여 동기화를 사용할 수 있다.
```java
RLock lock = redisson.getLock("myLock");

// traditional lock method
lock.lock();

// or acquire lock and automatically unlock it after 10 seconds
lock.lock(10, TimeUnit.SECONDS);

// or wait for lock aquisition up to 100 seconds 
// and automatically unlock it after 10 seconds
boolean res = lock.tryLock(100, 10, TimeUnit.SECONDS);
if (res) {
   try {
     ...
   } finally {
       lock.unlock();
   }
}
```
- 리액티브 환경에서의 락도 제공한다.
```java
RedissonReactiveClient redisson = redissonClient.reactive();
RLockReactive lock = redisson.getLock("myLock");

Mono<Void> lockMono = lock.lock();

// or acquire lock and automatically unlock it after 10 seconds
Mono<Void> lockMono = lock.lock(10, TimeUnit.SECONDS);

// or wait for lock aquisition up to 100 seconds 
// and automatically unlock it after 10 seconds
Mono<Boolean> lockMono = lock.tryLock(100, 10, TimeUnit.SECONDS);

lockMono.doOnNext(res -> {
   // ...
})
.doFinally(lock.unlock())
.subscribe();
```

<a id="network"></a>
# 아파치 톰캣
**아파치**
- 결국 아파치서버란 클라이언트에서 요청하는 HTTP요청을 처리하는 웹서버를 의미한다.
- 정적타입(HTML, CSS, 이미지 등)의 데이터만을 처리하기 때문에 톰캣이란 것이 등장한 것 같다.

**톰캣**
- 컨테이너, 웹 컨테이너, 서블릿 컨테이너로도 불림

> **서블릿이란**
> 클라이언트의 요청을 처리하고, 그 결과를 반환하는 Servlet 클래스의 구현 규칙을 지킨 자바 웹 프로그래밍 기술

**아파치 톰캣으로 부르는 이유**
- 기본적으로 아파치와 톰캣의 기능이 나뉘어 있지만, 톰캣 안에 있는 컨테이너를 통해 일부 아파치의 기능을 수행하기에 아파치 톰캣으로 부른다.

# 톰캣의 서블릿 컨텍스트
<!-- TODO -->

# 네트워크 브로드캐스트 vs 멀티캐스트
<!-- TODO -->

# 다른 서비스에서 리드 타임아웃 발생했을때 자동화 방법
<!-- TODO -->

<a id='deply'></a>
# JAR vs WAR
<!-- https://goodgid.github.io/Jar-vs-War/ -->

**Spring 에서 jar 혹은 war 설정하기**
<!-- https://hue9010.github.io/spring/springboot-war/ -->
<!-- https://gigas-blog.tistory.com/115 -->

<a id="kafka"></a>
# 카프카<sup>Kafka</sup>
<!-- toss -->
<!-- https://medium.com/@umanking/%EC%B9%B4%ED%94%84%EC%B9%B4%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C-%EC%9D%B4%EC%95%BC%EA%B8%B0-%ED%95%98%EA%B8%B0%EC%A0%84%EC%97%90-%EB%A8%BC%EC%A0%80-data%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C-%EC%9D%B4%EC%95%BC%EA%B8%B0%ED%95%B4%EB%B3%B4%EC%9E%90-d2e3ca2f3c2 -->
- 링크드인에서 개발된 분사나 메세징 시스템
- Producer가 생성한 메세지를 카프카 broker에게 전달하면, broker가 전달 받은 메세지를 토픽 별로 분류하여 쌓아놓으면, 해당 토픽을 구독하는 Consumer들이 메세지를 가뎌가 처리한다.
- 확장성<sup>sacel out</sup>과 고가용성<sup>high avilabilty</sup>을 위해 broker들은 cluster로 구성되어 동작하도록 설계되어있다.

**pub-sub 모델**
- 발행/구독 모델이라고 하며 메세지를 특정 수신자에게 직접 보내주는 시스템이 아니다.
- 퍼블리셔는 메세지를 **topic**을 통해 카테고리화 한다.
- 리시버는 해당 **topic**을 구독함으로써 메세지를 읽을 수 있다.
- 퍼블리셔와 리시버를 서로를 모르는 상태에서 topic을 통해 메세지를 전달하고 받아서 처리한다.

**카프카의 구성요소 및 특징**
- broker, zookeepr, cluster [<sup>link</sup>](#카프카-broker-zookeepr-cluster)
- topic, partiton [<sup>link</sup>](#카프카-topic과-partition)
- offset, commit [<sup>link</sup>](#카프카-offset과-commit)
- Producer, Consumer [<sup>link</sup>](#카프카-Producer-Consumer)
- consumer group [<sup>link</sup>](#카프카-consumer-group)
- rebalance [<sup>link</sup>](#카프카-rebalance)
- replication [<sup>link</sup>](#카프카-replication)

# 카프카 broker, zookeepr, cluster
![kafka-broker-zookeeper-0](https://user-images.githubusercontent.com/18159012/117541004-c1c75000-b04c-11eb-9243-fe284cab73fe.jpg)

**broker**
- 카프카 서버라고도 불린다.
- Priducer가 생성한 메세지를 받아서 오프셋을 관리하고 Consumer오부터 메세지를 읽으려는 요청에 응답하는 역할을 한다.
- 하나의 클러스터에 여러 개의 브로커를 가질 수 있다. 브로커의 숫자가 많아질 수록 단위 시간내의 처리량이 올라갈 수 있으므로 대용량의 데이터에도 대응할 수 있게된다.

**zookeeper**
<!-- TODO: -->
- brokers, topics, users 등의 상태를 저장한다.
- cluster 내에서 zookeeper는 3이상의 홀수개의 노드로 구성되어야 한다.
  권장하는 것는 3-5의 홀수로 유지하여 항상 과반수를 유지하고 오버헤드 리소스를 가능한 한 낮게 유지하는 것이다.
  7 이상의 노드는 노드간의 latency 오버헤드와 over-communication 때문에 권장하지 않는다.
- Kafka uses ZooKeeper to elect a leader partition

**cluster**
<!-- https://www.cloudkarafka.com/blog/part1-kafka-for-beginners-what-is-apache-kafka.html -->
- 하나의 카프카 cluster는 하나 이상의 카프카 broker로 구성된다.
- 하나의 cluster 안에 여러개의 zookeeper가 존재할 수 있다.
  <!-- zookeeper cluter of more than 7 nodes is not recommended for issues with overhead of latency and over-communication between those nodes. -->
- pub / sub 모델 패턴에서 메시지 관리를 담당한다.

# 카프카 topic과 partition
![kafka-topic-partition](https://user-images.githubusercontent.com/18159012/117531898-c9243480-b01f-11eb-82f8-93dff0f156d3.jpg)

**topic**
- 카프카 안에는 여러 레코드 스트림이 있을 수 있고 각 스트림을 topic이라고 부른다.
- 하나의 topic에 대해 여러 Subscriber가 붙을 수 있다.

**prtition**
- 메세지는 topic으로 분류되고, topic은 여러개의 partition으로 나눠질 수 있다.
- topic을 파티셔닝하는 이유는 프로듀서로부터 도착한 메시지의 순서가 보장되어야 하면서 동시에 성능을 향상하기 위해서 이다.
- 키값을 지정하여 해당 키를 가진 모든 메세지를 동일한 파티션으로 전송할 수 있다.
  덕분에 키갑을 지정하는 경우, 메세지의 순서를 보장 받을 수 있다.
- 키값을 지정하지 않을 경우, 메세지가 Round-robin 방식으로 파티션에 나뉘어 쓰여진다.
  때문에 여러 파티션을 쓰는 경우, 순차적으로 메세지가 쓰여지지 않기 때문에 순서차적으로 메세지가 소비어야할 때 유의해야 한다.
- offset은 그림처럼 각 partition에서 따로 관리된다.
- topic 이름, partition 번호, offset 번호의 조합을 통해 각 **레코드의 고유 ID**를 만들 수 있게 된다.
- 한 번 늘린 파티션은 절대로 줄일 수 없기 때문에 운영중에, 파티션을 늘려야 하는건 충분히 고려해봐야한다.

> **Round-robin**  
> 가장 먼저 들어온 프로세스가 할당받은 시간(Time Slice, QuanTum)에만 실행 후 다음 프로세스가 시간을 할당받음.  
> 할당되는 시간이 클 경우 FCFS와 비슷하게 된다.  
> 시간이 작을 경우 문맥 교환 및 오버헤드 자주 발생하게 된다.  

# 카프카 offset과 commit
**offset**
- 하나의 메시지 단위를 레코드(Record)라고 하고, 이 레코드들의 ID가 **offset**이다. 
- offset은 정수형 숫자로 이루어져있고 프로듀서로부터 메시지가 생성되면 오프셋 숫자는 하나씩 늘어나게 된다.
- Producer가 세 개의 메시지를 만들었고 broker가 이를 제대로 받으면 topic의 offset 상태는 다음과 같이 된다.

**commit**
![kafka-offset-commit](https://user-images.githubusercontent.com/18159012/117533480-0ee4fb00-b028-11eb-8d28-cb037e242b55.jpg)

- 컨슈머는 토픽에서 메시지를 읽은 후에 읽었다는 표시를 하는데, 이를 commit이라고 한다.
- commit을 통해 마지막까지 처리한 메시지의 위치를 알 수 있고 아직 안 읽은 메시지들을 이어서 처리할 수 있게 된다. 

# 카프카 Producer, Consumer
**Producer**
- 메세지를 생산하는 주체이다.

**Consumer**
- 메세지를 소비하는 주체로 하나의 프로세스 혹은 서버라고 할 수 있다.
- topic을 구독하여 메세지를 처리한다.
- 각각의 파티션에서 자신이 가져간 메시지의 위치 정보인 offset을 기록(=commit)하기 때문에, 메세지 처리를 실패해도 fail-over가 가능하다.
  - 0.9 버전 전엔 zookeeper에만 offset을 저장했지만 최신 버전의 경우 **__consumer_offsets**라는 topic에 consumer group 리스트가 저장됨 (zookeeper에도 여전히 커밋할 수 있음)
  - Consumer가 zookeeper에 의존하지 않고 외부 DB에 저장할 수도 있다.

# 카프카 consumer group
<!-- https://www.popit.kr/kafka-consumer-group/ -->
- Consumer들의 묶음이다.
- topic와 consumer group의 consumer는 1:n 매칭을 해야한다.
  - partition 3, consumer 2 : consumer 중 하나는 2개의 파티션을 소비
  - partition 3, consumer 3 : 모든 consumer가 1:1 매칭
  - partition 2, consumer 3 : 한 comsumer가 아무것도 하지 않음
  - 때문에 파티션을 늘릴때는 consumer의 갯수를 고려해야한다.
- 만약 consumer가 다운되거나 새롭게 조인한다면 consumer group 내에서 [rebalance](#카프카-rebalance)가 일어난다.

# 카프카 rebalance
<!-- https://joooootopia.tistory.com/30 -->
- consumer가 다운되거나 새롭게 조인한다면 consumer group 내에서 rebalance가 일어난다.
- rebalance가 일어난 후 각각의 consumer는 이전에 처리했던 topic의 partition이 아닌 새로운 partition에 할당된다.

# 카프카 replication
<!-- https://www.popit.kr/kafka-%EC%9A%B4%EC%98%81%EC%9E%90%EA%B0%80-%EB%A7%90%ED%95%98%EB%8A%94-topic-replication/ -->
![kafka-replication-1](https://user-images.githubusercontent.com/18159012/117544497-baa83e00-b05c-11eb-9e4e-d35d975f853f.jpg)

- kafka에서는 replication 수를 임의로 지정하여 topic를 만들 수 있다.
- 복제는 수평적으로 스케일 아웃이다. broker 3대에서 하나의 서버만 leader가 되고 나머지 둘은 follower 가 된다.

**partition leader**
- producer가 메세지를 쓰고, consumer가 메세지를 읽는 건 오로지 leader인 partition이 전적으로 역할을 담당한다.

**partition follower**
- follower들은 레플리카<sup>replica</sup>로 동작하며, leader와 싱크를 항상 맞춘다.
- 혹시나 leader가 죽었을 경우, 나머지 follower중에 하나가 leader로 선출되어서 메세지의 쓰고/읽는 것을 처리한다.

**ISR<sup>In Sync Replica</sup>**
- 각각의 replication group을 의미한다.
- ISR 내의 모든 follower들은 누구라도 leader가 될 수 있다.
- leader는 follower 중에서 자신보다 일정기간 동안 뒤쳐지면 leader가 될 자격이 없다고 판단하여 뒤쳐지는 follower를 ISR에서 제외시킨다. 
- follower는 leader와 동일한 데이터 내용을 유지하기 위해서 짧은 주기로 leader로부터 데이터를 가져온다.

<a id="spring-batch"></a>
# 스프링 Batch
<!-- https://cheese10yun.github.io/spring-batch-basic/ -->
<!-- https://freedeveloper.tistory.com/18 -->
![spring-batch-job-1](https://user-images.githubusercontent.com/18159012/117576179-ca3c8b00-b11f-11eb-9447-0f564b3e19b7.jpg)

**장점**
- 대용량 데이터 처리에 최적화되어 고성능을 발휘한다.
- 효과적인 로깅, 통계 처리, 트랜잭션 관리 등 재사용 가능한 필수 기능을 지원한다.
- 수동으로 처리하지 않도록 자동화되어 있다.
- 예외사항과 비정상 동작에 대한 방어 기능이 있다.
- 스프링 부트 배치는 반복적인 작업 프로세스를 이해하면 비니지스로직에 집중할 수 있다.

**유의점**
- 가능하면 단순화해서 복잡한 구조와 로직을 피해야한다.
- 데이터를 직접 사용하는 편이 빈번하게 일어나므로 데이터 무결성을 우지하는데 유효성 검사 등의 방어책이 있어야한다.
- 배치 처리 시스템 I/O 사용을 최소화해야한다. 잦은 I/O로 데이터베이스 컨넥션과 네트워크 비용이 커지면 성능에 영향을 줄 수 있기 때문이다. 따라서 **가능하면 한번에 데이터를 조회하여 메모리에 저장해두고 처리를 한 다음. 그결과를 한번에 데이터베이스에 저장하는것이 좋다.**
일반적으로 같은 서비스에 사용되는 웹 API, 배치, 기타 프로젝트들을 서로 영향을 준다. 따라서 배치 처리가 진행되는 동안 다른 프로젝트 요소에 영향을 주는 경우가 없는지 주의를 기울여야한다.
- 스프링 부트는 배치 스케쥴러를 제공하지 않는다. 따라서 배치 처리 기능만 제공하여 스케쥴링 기능은 스프링에서 제공하는 쿼치 프레임워크 등을 이용해야한다. 리눅스 crontab 명령은 가장 간단히 사용 할 수 있지만 이는 추천하지 않는다. crontab의 경우 각 서버마다 따로 스케쥴러를 관리해야 하며 무엇보다 클러스터링 기능이 제공되지 않는다. 반면에 쿼츠 같은 스케쥴링은 프레임워크를 사용한다면 클러스터링뿐만 아니라 다양한 스케쥴링 기능, 실행 이력 관리 등 여러 이점을 얻을 수 있다.

**동작의 단계**
- 읽기 : 데이터 저장소에서 특정 데이터 레코드를 읽는다.
- 처리 : 원하는 방식으로 데이터를 가공/처리한다.
- 쓰기 : 처리된 데이터를 저장소에 저장한다.

**스프링 배치 구성요소**
- Job
- Step
- JobRepository
- JobLauncher
- Tasklet vs Chunk
- ItemReader
- ItemProcessor
- ItemWrtier
- Parallels

# 스프링 배치 Job
**Job**
- 배치 처리 과정을 하나의 단위로 만들어 포현한 객체이다.
- 하나의 Job에는 여러 Step이 존재하며, Step을 포함하는 컨테이너이다.
- 스프링에서 제공하는 빌더들을 통해 Job을 만들 수 있다.

**JobInstance**
- 배치 처리에서 Job이 실행될 때 하나의 Job의 실행 단위이다.
- 매일 동작하는 배티에서 Job이 실패한 경우 다음날 같은 JobInstance를 통해 다시 실행한다.
- JobInstance는 여러개의 JobExecution을 가질 수 있다. (재실행 한 경우)

**JobExecution**
- JobExecution은 JobInstance 한번의 실행을 나타내는 객체이다.
- 실패한 JobInstance를 재실행하는 경우 JobInstance는 동일하지만 JobExecution은 다르다.
- JobExecution 인터페이스를 보면 Job 실행에 대한 JobInstance, 배치 실행 상태, 시작 시간, 끝난 시간, 실패했을 때 메시지 등의 정보를 담고있는 도메인 객체가 있다.

**JobParameter**
- Job이 실행될 때 필요한 파라메터들을 Map 타입으로 지정하는 객체이다.
- JobInstance를 구분하는 기준이 되기도 한다.
- JobParameter와 JobInstance는 1:1 관계이다.

# 스프링 배치 Step
**Step**
- Job은 하나 이상의 Step으로 구성되다.
- Job을 처리하는 실질적인 단위이다.
- 일반적인 경우 Step은 하나씩 차례대로 동작한다.

**StepExecution**
- Job과 JobExecution의 관계처럼 StepExecution은 Step 실행에 대한 정보를 담는 객체이다.

# JobRepository
- 어떤 Job이 실행되었으면 몇 번 실행되었고 언제 끝났는지 등 배치 처리에 대한 메타데이터를 저장한다.
- 예를들어 Job 하나가 실행되면 JobRepository에서는 배치 실행에 관련된 정보를 담고 있는 도메인 JobExecution을 생성한다.
- Step의 실행 정보를 담고 있는 StepExecution도 저장소에 저장하여 전체 메타데이터를 저장/관리하는 역할을 수행한다.

# JobLauncher
-  Job, JobParameter와 함께 배치를 실행하는 인터페이스이다.

# 스프링 배치 tasklet vs chunk
<!-- https://www.baeldung.com/spring-batch-tasklet-chunk -->
**tasklet**
- Step으로 동작하는 하나의 단계를 의미한다.
- Step을 tasklet으로 구성할 때, 단 하나의 tasklet으로만 구성된다.
  (TaskletStepBuilder에서도 tasklet 멤버변수를 하나만 들고있도록 하여 여러번 설정하는 경우 오버라이딩 되게 되어있다)
- 단점
  - 배치 작업중에 하나의 데이터에 예외가 발생하여 롤백이 되는 경우, 전체 데이터가 롤백이 되게 된다.

**chunk**
![spring-batch-chunk-1](https://user-images.githubusercontent.com/18159012/117567825-eda00f80-b0f8-11eb-82de-4e594160c3eb.jpg)

- 모든 데이터 레코드를 한번에 처리하는 것이 아닌, 고정된 양의 레코드(chunk) 씩 읽고 처리하고 쓰는 세 단계로 나눠 처리하며, 더 이상 데이터가 없을 떄 까지 반복한다.
- Chunk 단위로 트랜잭션을 수행하기 때문에 실패할 경우엔 해당 Chunk 만큼만 롤백이 되고, 이전에 커밋된 트랜잭션 범위까지는 반영이 된다.
- `ChunkOrientedTasklet`이 Step의 tasklet으로 사용된다.

# 스프링 배치 ItemReader
<!-- https://jojoldu.tistory.com/336 -->
- 데이터를 읽어들이는 단계로 DB뿐만 아니라 파일, XML, Json등 다른 데이터 소스를 입력으로 사용할 수 있다.
- **ItemReader 인터페이스**
  - `read()` 메서드만 갖고있으며 읽는 것을 담당한다.
- **ItemStream 인티페이스**
  - `open()`, `update()`, `close()` 메서드를 갖는 인터페이스.
    - `open()`, `close()` : 스트림을 열고 닫는다.
    - `update()` : 배치 처리의 상태를 업데이트할 수 있다.

**DB reader**
- 모든 데이터를 전부 읽어 메모리에 적재하는 것을 피하기 위해 read() 메서드가 동작 할 때마다, 적절한 크기의 데이터를 읽어야 한다.
- Cursor 기반 ItemReader 구현체
  - cursor 방식은 DB와 커넥션을 맺은 후 cursor를 한칸씩 옮기면서 지속적으로 데이터를 가져온다.
  - `String` 타입으로 쿼리를 생성한다.
  - () 스레드 세이프하지 않아 멀티 스레드에서 권장되지 않는 것 같다.
  - `JdbcCursorItemReader`, `HibernateCursorItemReader`, `StoredProcedureItemReader`
- Paging 기반 ItemReader 구현체
  - 개발자가 지정한 paging 크기만큼씩 DB로 부터 데이터를 가져온다.
  - cursor 방식과 달리 `QueryProvider` 타입으로 쿼리를 생성한다. 각 DB에 맞는 페이징 전략을 사용하기 위해.
  - paging 크기에 따라 limit을 사용하여 조회되기 때문에 순서를 보장하는 order by 등의 구문을 사용해야 한다.
  - `JdbcPagingItemReader`, `HibernatePagingItemReader`, `JpaPagingItemReader`

# 스프링 배치 병렬처리
- 배치는 대용량 환경에서 사용되는 경우가 많기 때문에 많은 데이터를 빠르게 처리하는 것이 관건이다.
- process와 write에서 무거운 작업이 동작한다면 병렬처리를 통해 동작 시간을 줄일 수 있다.

**Single-threaded**
- TaskExecutor를 설정하지 않거나 테스트 환경을 위해 구현 되어 있는 `SyncTaskExecutor`를 설정하면 된다.
- 동기적으로 동작하며, chunk가 가지는 순차적인 아이템을 가지고 동작한다.

**Multi-threaded Step** (싱글 프로세스)
- 병렬처리를 시작하는 가장 쉬운 방법은 `StepBuilder` 에서 비동기 `TaskExecutor`를 설정하는 것이다.
- 청크 단위로 각 스레드에서 처리하기 때문에 단일 스레드와 달리 처리되는 각 청크는 연속적이지 않다.
- tasklet에 디폴트로 4인 throttle limit이 존재하기 때문에 스레드 풀을 충분히 사용하고 싶을 경우 이 값을 변경해야한다.

> **throttle limit**  
> 해당 값은 tasklet이 비동기로 동작할 때, tasklet이 몇개의 스레드에서 동작할지 결정한다.
> 각각의 tasklet에서 read와 write가 동작하기 때문에 데이터 소스 커넥션 풀보다 적게 설정되어야 한다.

**Parallel Steps** (싱글 프로세스)
- 배치 잡을 각 역할별로 여러 step으로 나눌 수 있으면 싱글 프로세스에서도 병렬와하여 처리할 수 있다.
- step을 `Flow`를 통해 step들을 병렬로 처리할 수 있다.
- flow는 step을 순차적으로 실행하고, flow들을 순차적 혹은 동시에 실행할 수 있다.
  여러 flow를 동시에 실행하기 위해선 비동기 `TaskExecutor`를 설정해야한다. (디폴트 동기)

```java
    @Bean
    public Job job() {
        return jobBuilderFactory.get("job")
            .start(splitFlow())
            .next(step4())
            .build() // builds FlowJobBuilder instance
            .build(); // builds Job instance
    }

    @Bean
    public Flow splitFlow() {
        return new FlowBuilder<SimpleFlow>("splitFlow")
            .split(taskExecutor())
            .add(flow1(), flow2())
            .build();
    }

    @Bean
    public Flow flow1() {
        return new FlowBuilder<SimpleFlow>("flow1")
            .start(step1())
            .next(step2())
            .build();
    }

    @Bean
    public Flow flow2() {
        return new FlowBuilder<SimpleFlow>("flow2")
            .start(step3())
            .build();
    }

    @Bean
    public TaskExecutor taskExecutor(){
        return new SimpleAsyncTaskExecutor("spring_batch");
    }
```

- `Flow`를 통해서 병렬처리 뿐만 아니라 조건에 따라 다음 step리 선택되도록 할 수 있다.

**Remote Chunk** (멀티 프로세스)
<!-- https://docs.spring.io/spring-batch/docs/current/reference/html/scalability.html#remoteChunking -->
![spring-batch-remote-chunk-1](https://user-images.githubusercontent.com/18159012/117574922-86935280-b11a-11eb-99a5-1b52f34f4cde.jpg)

- step을 여러 프로세스로 나눠서 미들웨어를 통해서 프로세스끼리 통신한다.
- 매니커 컴포넌트는 싱글 프로세스이고, 워커는 여러 리모트 프로세스로 구성된다.
- 매니저는 아이템 chunk를 미들웨어에 전송하는 `ItemWriter`로 만든 스프링 배치 `Step`이다.
- 이 방식의 장점은 이미 있는 reader, processor, writeer를 사용할 수 있다는 것이다.
- 미들웨어를 통해 작업을 공유할때 워커가 바쁘다면 로드 밸런싱된다.

**Partitioning** (멀티 프로세스)
<!-- https://docs.spring.io/spring-batch/docs/current/reference/html/scalability.html#partitioning -->
![spring-batch-partitioning-1](https://user-images.githubusercontent.com/18159012/117575620-982a2980-b11d-11eb-8978-26dba6fbd3bd.jpg)

- Step 을 파티셔닝하기 위해, 그리고 리모트 환경에서 동작하기 위한 SPI를 제공한다.
- Job은 일련의 Step으로 동작하며 그중 하나는 master(manager)로 동작한다.
- 모든 worker는 사실상 master를 대신해 동작하는 `Step`이다.
- master는 실제 데이터를 건네는 것이 아닌 처리할 데이터의 description(`StepExecution`)을 전달한다.
- 전형적인 worker는 원셧 서비스지만 로컬 스레드로 실행할 수도 있다.
- 동작
  - `PartitionStep` 에서 `TaskletStep`과 달리 tasklet이 아닌 `PartitionHandler.handle()`을 통해 master의 `StepExecution`을 핸들링한다.
  - master의 `StepExecution`을 `StepExecutionSplitter` 안에서 `Partitioner`를 통해 woker의 `StepExecution`으로 나눠진다.

> **Partitioning SPI<sup>Service Provider Interface</sup>**  
> PartitionHandler
> StepExecutionSplitter
> Partitioner

# 프로젝트와 관련된 질문
