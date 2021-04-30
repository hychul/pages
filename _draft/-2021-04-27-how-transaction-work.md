https://woowabros.github.io/experience/2019/01/29/exception-in-transaction.html

reactor와 transaction
https://suhwan.dev/2020/01/16/spring-transaction-common-mistakes/

do not use transaction(save) in parallel stream
https://www.javacodegeeks.com/2019/09/should-parallel-streams-transaction-context.html

definitions
https://sarc.io/index.php/java/1965-transaction

batch insert
https://cheese10yun.github.io/jpa-batch-insert/

# TransactionManger

Spring 에서 `abstractPlatformTransactionManager` 라는 추상 클래스를 제공한다. 해당 클래스를 상속받아 DataSource(JDBC에서 사용), JPA, JTA 등의 트랜잭션 매니저 구현체가 구현된다.

# Transaction Propagation

REQUIRED : 이미 시작된 트랜잭션(부모 트랜잭션)이 있으면 참여하고 없으면 새로 시작한다. (디폴트)  
SUPPORTS : 이미 시작된 트랜잭션이 있으면 참여하고 없으면 트랜잭션 없이 진행한다.  
REQUIRED_NEW : 부모 트랜잭션을 무시하고 항상 새로운 트랜잭션을 시작한다.  
NESTED : 메인 트랜잭션 내부에 중첩된 트랜잭션을 시작한다. 부모 트랜잭션 결과에는 영향을 받지만, 자신의 트랜잭션 결과는 부모에게 영향을 미치지 않는다.  
NOT_SUPPORTED : 트랜잭션을 사용하지 않게 한다. 이미 진행 중인 트랜잭션이 있으면 보류시킨다.  
MANDATORY : REQUIRED와 비슷하게 이미 시작된 트랜잭션이 있으면 참여하지만, 트랜잭션이 시작된 것이 없으면 예외를 발생시킨다. (혼자서 독립적으로 트랜잭션을 진행하면 안되는 경우에 사용)  
NEVER : 트랜잭션을 사용하지 않게 하며 이미 시작된 트랜잭션이 있으면 예외를 발생시킨다.  

# Transactional 속성

DEFAULT : 기본 설정, 기본 격리 수준  
SERIALIZABLE : 가장 높은 격리, 성능 저하 가능성 있음  
READ_UNCOMMITED : 커밋되지 않은 데이터 읽을 수 있음  
READ_COMMITED : 커밋된 데이터에 대해 읽기 허용  
REPEATABLE_READ : 동일 필드에 대한 다중 접근 시 동일 결과 보장  