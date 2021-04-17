5장에선 엔터프라이즈 어플리케이션의 트랜젝션에 대해 설명한다. 또한 자바에서 사용되는 다양한 트랜젝션을 편리하게 사용하기 위한 스프링이 제공하는 트랜젝션 서비스 추상화에 대해 소개하고 서비스 추상화의 중요성과 그 가치와 의미에 대해서도 설명한다.

## 트랜젝션 경계설정

하나의 SQL 명령을 처리하는 경우엔 DB는 그 자체로 완벽한 트랜젝션을 지원한다. 하지만 여러 개의 SQL이 사용되는 작업을 하나의 트랜잭션으로 취급해야 하는 경우도 있다. 첫번째 SQL을 성공적으로 실행했지만 두 번째 SQL이 성공하기 전에 장애가 생겨 작업이 중단된 경우 문제가 발생한다. 이때 두 가지 작업이 하나의 트랜잭션이 되기 위해 트랜잭션 롤백<sup>Transaction Rollback</sup>을 통해 이전 작업도 취소시켜야한다. 반대로 모든 SQL 수행 작업이 다 성공적으로 마무리 된 경우 트랜잭션 커밋<sup>Transaction Commit</sup>을 통해 SQL 수행 작업이 성공적으로 마무리 되었다고 DB에 알려 작업을 확정시켜야 한다.

## JDBC 트랜잭션의 트랜잭션 경계설정

모든 트랜잭션은 한 가지의 시작 지점과 두 가지의 끝나는 지점이 있다. 어플리케이션 내에서 트랜잭션이 시작되고 끝나는 위치를 트랜잭션의 경계라고 부른다. 복잡한 로직의 흐름 사이에서 정확하게 트랜잭션 경계를 설정하는 일은 매우 중요한 작업이다.

 **JDBC의 트랜잭션은 하나의 Connection을 가져와 사용하다가 닫는 사이에서 일어난다.** 트랜잭션의 시작과 종료는 Connection 오브젝트를 통해 이뤄지기 때문이다. JDBC에서 트랜잭션을 시작하려면 Connection의 setAutoCommit() 메소드를 통해 자동커밋 옵션을 false로 만들어 주면 된다. 트랜잭션이 한 번 시작되면 commit() 또는 rollbak() 메소드가 호출 될 때까지의 작업이 하나의 트랜잭션으로 묶인다.

 이렇게 **setAutoCommit(false)로 트랜잭션의 시작을 선언하고 commit() 또는 rollback()으로 트랜잭션을 종료하는 작업을 트랜잭션의 경계설정<sup>Transaction Demarcation</sup>이라고 한다.** 이렇게 하나의 DB 커넥션 안에서 만들어지는 트랜잭션을 **로컬 트랜잭션<sup>Local Tranaction</sup>**이라고도 한다.

## UserDao의 문제

 JdbcTempate은 하나의 템플릿 메소드 안에서 DataSource의 getConnection 메소드를 호출해 Connection 오브젝트를 가져오고 작업을 마친 후 Connection을 닫은 후 템플릿 메소드를 빠져나온다. 결국 템플릿 메소드 호출 한 번에 한 개의 DB 커넥션이 만들어지고 닫히는 일까지 일어하는 것이다. 때문에 JdbcTemplate을 사용하는 Dao 클래스는 메소드 마다 독립적인 트랜잭션으로 실행될 수밖에 없다.

 updateLevels()에서 세 번에 걸쳐 UserDao의 update()를 호출할 때, 첫번째 update() 작업이 성공했다면 이미 트랜잭션이 종료되면서 커밋됐기 때문에 두 번째 update()가 실패하더라도 첫 번째 커밋한 트랜잭션의 결과는 DB에 그대로 남는다.

![tobis-spring-3 1-vol1-chapter5-0](https://user-images.githubusercontent.com/18159012/38912557-e6062006-4310-11e8-9e16-19680bc94bfc.png)

 **어떤 일련의 작업이 하나의 트랜잭션으로 묶이려면 그 작업이 진행되는 동안 DB 커넥션도 하나만 사용돼야 한다.** 앞에서 설명한 것처럼 트랜잭션은 Connection 오브젝트 안에서 만들어지기 때문이다.

## 비즈니스 로직 내의 트랜잭션 경계설정

 JDBC API를 직접 이용한다면 하나의 DB 커넥션과 트랜잭션을 만들어 놓고 여러명의 사용자에 대한 정보를 업데이트 할 수 있다. 하지만 이 방식은 비즈니스 로직과 데이터 로직을 한데 묶어버리는 한심한 결과를 초래한다. UserService와 UserDao를 그대로 둔 채로 트랜잭션을 적용하려면 결국 트랜잭션의 경계설정 작업을 UserService 쪽으로 가져와야한다. 프로그램 흐름을 볼 때 비즈니스 메소드의 시작과 함께 트랜잭션이 시작하고 메소드를 빠져나올 때 트랜잭션이 종료돼야 하기 때문이다.

 트랜잭션의 경계를 upgradeLevels() 메소드 안에 두려면 DB 커넥션도 이 메소드 안에서 만들고, 종료시킬 필요가 있다. 결국 트랜잭션 경계 설정을 다음과 같은 구조로 만들어야 한다.

```java
public void upgradeLevels() throws Exception {
    (1) DB Connection 생성
    (2) 트랜잭션 시작
    try {
        (3) DAO 메소드 호출
        (4) 트랜잭션 커밋
    } catch (Exception e) {
        (5) 트랜잭션 롤백
        throw e;
    } finally {
        (6) DB Connection 종료
    }
}
```

 트랜잭션 때문에 DB 커넥션과 트랜잭션 관련 코드는 어쩔 수 없이 UserService로 가져왔지만, 순수한 데이터 액세스 로직은 UserDao에 둬야 하기 때문에 생성된 Connection을 UserDao에게 파라메터로 전달해줘야 한다. 또한 UserDao의 update() 메소드를 사용하는 메소드는 upgradeLevels() 메소드가 아니라 upgradeLevel() 메소드이기 때문에, UserService의 메소드 사이에서도 같은 Connection 오브젝트를 파라메터로 넘겨줘야한다.

```java
class UserService {
    public void upgradeLevels() throw Exception {
        Connection c = ...;
        ...
        try {
            ...
            upgradeLevel(c, user);
            ...
        }
        ...
    }
    
    protected void upgradeLevel(Connection c, User user) {
        user.upgradeLevel();
        userDao.update(c, user);
    }
}
```

```java
interface UserDao {
    public update(Connection c, User user);
    ...
}
```

## UserService 트랜잭션 경계설정의 문제점

 위의 방법으로 트랜잭션 문제는 해결할 수 있지만, 그 대신 새로운 문제가 발생한다.

1. 리소스의 깔끔한 처리를 가능하게 했던 JdbcTemplate을 더 이상 활용할 수 없다.
2. DAO의 메소드와 비즈니스 로직을 담고 있는 UserService의 메소드에 Connection 파라메터가 추가돼야 하기 때문에 메소드가 지저분 해질 수 있다.
3. Connection 파라메터가 UserDao 인터페이스 메소드에 추가되면 UserDao는 더 이상 데이터 엑셋스 기술에 독립적일 수가 없다.
4. 테스트 코드에서 일일이 Connection 오브젝트를 만들어 DAO 메소드를 호출하도록 테스트를 모두 변경해야 한다.

# 트랜잭션 동기화

스프링은 위에서의 딜레마를 해결하기 위해 독립적인 트랜잭션 동기화<sup>Transaction Synchronization</sup>방식을 제공한다. **트랜젝션 동기화란 UserService에서 트랜잭션을 시작하기 위해 만든 Connection을 특별한 저장소에 보관해주고, 이후에 호출되는 DAO의 메소드에서는 저장된 Connection을 가져다가 사용하게 하는 것이다.** 정확하게는 JdbcTemplate이 트랜잭션 동기화를 이용하게 하는 것이다.

![tobis-spring-3 1-vol1-chapter5-1](https://user-images.githubusercontent.com/18159012/38935320-07336f7a-4359-11e8-92fb-679c1c74d25d.png)

어느 작업 중에라도 UserService는 Connection의 rollback()을 호출하여 트랜잭션을 종료할 수 있다. 물론 이때도 트랜잭션 저장소에 저장된 동기화된 Connection 오브젝트는 제거해줘야한다.

 트랜잭션 동기화 저장소는 작업 스레드마다 독립적으로 Connection 오브젝트를 저장하고 관리하기 때문에 다중 사용자를 처리하는 서버의 멀티스레드 환경에서도 충돌이 날 염려는 없다.

## 트랜잭션 동기화 적용

 멀티스레드 환경에서 안전한 트랜잭션 동기화 방법을 구현하는 일이 기술적으로 간단하지 않지만 스프링은 JdbcTemplate과 더불어 트랜잭션 동기화 기능을 지원하는 간단한 유틸리티 메소드를 제공하고 있다.

```java
private DataSource dataSource;

public void setDataSource(DataSource data) {
    this.dataSource = dataSource;
}

public void upgradeLevels() throws Exception {
    TransactionSynchronizationManager.initSynchronization();
    Connection c = DataSourceUtils.getConnection(dataSource);
    c.setAutoCommit(false);
    
    try {
        List<User> users = userDao.getAll();
        for (User user : users) {
            if (canUgradeLevel(user)) {
                upgradeLevel(user);
            }
        }
        c.commit();
    } catch (Exception e) {
        c.rollback();
        throw e;
    } finally {
        DataSourceUtils.releaseConnection(c, dataSource);
        TransactionSynchronizationManager.unbindResource(dataSource);
        TransactionSynchronizationManager.clearSynchronization();
    }
}
```

 **스프링이 제공하는 트랜잭션 동기화 관리 클래스는 TransactionSynchrinizationManager다.** initSynchronization() 메소드를 통해 트랜잭션 동기화 작업을 초기화한 후, DataSourceUtils에서 제공하는 getConnection() 메소드를 통해 트랜잭션 동기화를 위해 저장소에 바인딩하며 DB 커넥션을 생성한다. 동기화 준비가 되었으면 setAutoCommit() 메소드로 트랜잭션을 시작하고 작업이 정상적으로 마치면 commit() 메소드를, 예외가 발생한 경우 rollback() 메소드를 호출한다.

 JDBC의 트랜잭션 경계설정 메소드를 사용해 트랜잭션을 이용하는 전형적인 코드에 간단한 트랜잭션 동기화 작업만 붙여줌으로써,  지저분한 Connection 파라메터 문제를 해결할 수 있다.

## JdbcTemplate 트랜잭션 동기화

 JdbcTemplate은 JDBC 작업의 템플릿 메소드를 호출하면 스스로 Connection을 생성하서 사용한다고 앞서 설명했다. 하지만 이렇게 직접 Connection을 생성하는 것은 트랜잭션 동기화 저장소에 등록된 DB 커넥션이나 트랜잭션이 없는 경우이다. upgradeLevels() 메소드에서처럼 트랜잭션 동기화를 시작해 놓았다면 직접 DB 커넥션을 만드는 대신 트랜잭션 동기화 저장소에 들어있는 DB 커넥션을 가져와서 사용한다.

 따라서 DAO를 사용할 때 트랜잭션이 굳이 필요 없다면 바로 호출해서 사용해도 되고, DAO 외부에서 트랜잭션을 만들고 이를 관리할 필요가 있다면  미리 DB 커넥션을 생성한 다음 트랜잭션 동기화를 해주고 사용하면 된다. 때문에 트랜잭션 적용 여부에 맞춰 UserDao 코드를 수정할 필요가 없다. 이는 JdbcTemplate이 제공하는 세 가지 유용한 기능[^JdbcTemplate의 유용한 기능] 중 하나다.

[^JdbcTemplate의 유용한 기능]: JdbcTemplate의 유용한 기능: 1) try/catch/finally 작업 흐름 지원 2) SQLException 예외 변환 3) 트랜잭션 동기화 지원

#  트랜잭션 서비스 추상화

 하나의 DB를 사용하고 있는 경우엔 위의 방법으로 충분하지만, 하나의 트랜잭션 안에서 여러 개의 DB에 데이터를 넣는 작업을 해야 할 경우 로컬 트랜잭션으로는 불가능 하다. 로컬 트랜잭션은 하나의 DB 커넥션에 종속적이기 때문이다. 따라서  각 DB와 독립적으로 만들어지는 Connection을 통해서가 아니라, 별도의 트랜잭션 관리자를 통해 여러개의 DB가 참여하는 작업을 트랜잭션으로 관리하는 **글로벌 트랜잭션<sup>Global Transaction</sup>** 방식을 사용해야한다. 이를 통해 여러 DB에 대한 트랜젝션 뿐만 아니라 JMS(Java Message Service)와 같이 트랜잭션 기능을 제공하는 서비스도 트랜잭션에 참여 시킬 수 있다.

 자바는 글로벌 트랜잭션을 지원하는 트랜잭션 매니저를 지원하기 위해 JTA<sup>Java Transaction API</sup>를 제공한다. 어플리케이션에서는 기존의 방법대로 DB는 JDBC, 메시징 서버라면 JMS 같은 API를 사용해 작업을 수행하고, 트랜잭션은 직접 제어하지 않고 JTA를 통해 트랜잭션 매니저가 관리하도록 위임한다.

![tobis-spring-3 1-vol1-chapter5-3](https://user-images.githubusercontent.com/18159012/38938108-c3e5b9c4-435f-11e8-87e3-2cfc86fc95b4.png)

```java
InitialContext ctx = new InitailContext();
UserTransaction tx = (UserTransaction) ctx.lookup(USER_TX_JNDI_NAME);

tx.begin();
Connection c = dataSource.getConnection();
try {
    // 데이터 엑세스 코드
    tx.commit();
} catch (Exception e) {
    tx.rollback();
    throw e;
} finally {
    c.close();
}
```

 JTA를 사용한 트랜잭션 경계설정 구조는 JDBC를 사용했을 때와 비슷하다. 하지만 로컬 트랜잭션을 위한 코드에 JDBC를 이용한 트랜잭션을, 글로벌 트랜잭션을 위해 JTA를 사용해서 코드를 작성하면, UserService의 로직이 바뀌지 않더라도 기술 환경에 따라 코드가 바뀌게 되는 문제가 생긴다.

## 스프링의 트랜잭션 서비스 추상화

스프링은 트랜잭션 기술의 공통점을 담은 트랜잭션 추상화 기술을 제공하고 있다. 이를 통해 어플리케이션에서 직접 각 기술의 트랜잭션 API를 이용하지 않고도, 일관된 트랜잭션 경계설정 작업이 가능해진다.

![tobis-spring-3 1-vol1-chapter5-4](https://user-images.githubusercontent.com/18159012/38938547-bb4f44b4-4360-11e8-9d06-2a99d7d4e2e6.png)

스프링이 제공하는 트랜잭션 추상화 방법을  UserService에 적용하면 다음과 같은 코드로 만들 수 있다.

```java
public void upgradeLevels() {
    PlatformTransactionManager transactionManager = new DataSourceTransactionManager(dataSource);
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
    try {
        List<User> users = userDao.getAll();
        for (User user : users) {
            if (canUpgradeLevel(user)) {
                upgradeLevel(user);
            }
        }
        transactionManager.commit(status);
    } catch (RuntimeException e) {
        transactionManager.rollback(status);
        throw e;
    }
}
```

 스프링이 제공하는 트랜잭션 경계설정을 위한 추상 인터페이스는 PlatformTransactionManager다. JDBC의 로컬 트랜잭션을 사용하려면 PlatformTransactionManager을 구현한 DataSourceTransactionManager를 사용하면 된다.

 JDBC를 사용하는 경우에 먼저 Connection을 생성하여 사용했지만,  PlatformTransactionManager에서는 트랜잭션을 가져오는 요청인 getTransaction() 메소드를 호출하기만 하면 된다. 메소드가 호출되면 트랜잭션 매니저가 필요에 따라 DB 커넥션을 가져오는 작업도 같이 수행해준다.

 파라메터로 넘기는 DefualtTransactionDefinition 오브젝트는 트랜잭션에 대한 속성을 담고 있다.

 getTransation() 메소드 호출로 시작된 트랜잭션은  TransactionStatus  타입의 변수에 저장된다. 때문에 트랜잭션의 조작이 필요한 경우 PlatformTransactionManager 메소드의 파라메터로 전달해주면 된다. DataSourceTransactionManager오브젝트에서  JdbcTemplate에서 사용될 수 있는 방식으로 트랜잭션을 관리해주기 때문에 시작된 트랜잭션은 UserDao의 JdbcTemplate 안에서 사용된다.

 트랜잭션 작업을 모두 수행한 후에는 트랜잭션을 만들 때 돌려받은 TransactionStatus 오브젝트를 파라미터로 해서 commit() 메소드를 호출하면된다. 예외가 발생한 경우엔 rollback() 메소드르 트랜잭션 작업을 취소한다.

## 트랜잭션 기술 설정의 분리

 트랜잭션 추상화를 적용한 UserService 코드를 JTA를 이용하는 클로벌 트랜잭션으로 변경하려면, PlatformTransactionManager을 구현한 DataSourceTransactionManager를 JTATransactionManager로 바꿔주기만 하면 된다.

 만약 Hibernate로 UserDao를 구현했다면 HibernateTransactionManager를, JPA로 구현했다면 JPATransactionManager를 사용하면 된다. 모두 PlatformTransactionManager를 구현한 것이니 트랜잭션 경계설정을 위한 getTransaction(), commit(), rollback() 메소드를 사용한 코드는 전혀 손댈 필요가 없다.

 하지만 어떤 트랜잭션 매니저 구현 클래스를 사용하는지 UserService가 알고있는 것은 DI 원칙에 위배되므로, PlatformTransactionManager 구현 클래스를 스프링 빈으로 등록하고 UserService가 DI 방식으로 사용하게 해야한다. 스프링이 제공하는 PlatformTransactionManager 구현 클래스들은 스레드 세이프하기 때문에 싱글톤 빈으로 등록이 가능하다.

```xml
<bean id="userService" class="user.service.UserService">
    <property name="userDao" ref="userDao" />
    <property name="transactionManager" ref="transactionManager" />
</bean>

<bean id="transactionManager" class="org.springframwork.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource" />
</bean>
```

```java
public class UserService {
    ...
    private PlatformTransactionManager transactionManager;
    
    public void setTransactionManager(PlatformTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }
    
    public void upgradeLevels() {
        TransactionStatus status = this.transactionManager.getTransaction(new DefaultTransactionDefinition());
        try {
            List<User> users = userDao.getAll();
            for (User user : users) {
                if (canUpgradeLevel(user)) {
                    upgradeLevel(user);
                }
            }
            this.transactionManager.commit();
        } catch (RuntimeException e) {
            this.transactionManager.rollback();
            throw e;
        }
    }
    ...
}
```

 JTATransactionManager는 어플리케이션 서버의 트랜잭션 서비스를 이용하기 때문에 직접 DataSource와 연동할 필요는 없지만, JTA를 사용하는 경우엔 DataSource도 서버가 제공하는 것을 사용해야한다.

 DAO를 Hibernate나 JPA, JDO 등을 사용하도록 수정했다면 UserService 코드의 수정 없이 transactionManager 클래스만 변경해주면 된다.

# 서비스 추상화와 단일 책임 원칙

 기술과 서비스에 대한 추상화 기법을 이용하면 특정 기술 환경에 종속되지 않는 코드를 만들 수 있다. UserDao와 UserService는 같은 어플리케이션 로직을 담았지만 각각 담당하는 기능에 따라 분리되었다. 같은 계층에서의 수평적인 분리라고 볼 수 있다.

 트랜잭션의 추상화는 이와 좀 다르다. 어플리케이션의 비즈니스 로직과 그 하위에서 동작하는 로우레벨의 트랜잭션 기술이라는 아예 다른 계층을 특성을 갖는 코드를 분리한 것이기 때문이다.

![tobis-spring-3 1-vol1-chapter5-2](https://user-images.githubusercontent.com/18159012/38937634-9b28516e-435e-11e8-9a7a-07e52cf48423.png)

 위와같이 어플리케이션 로직의 종류에 따른 수평적인 구분이든, 로직과 기술이라는 수직적인 구분이든 모두 결합도가 낮으며, 서로 영향을 주지 않고 자유롭게 확장될 수 있는 구조를 만들 수 있는 데는 스프링의 DI가 중요한 역할을 하고 있다. **DI의 가치는 이렇게 관심, 책임, 성격이 다른 코드를 깔끔하게 분리하는 데 있다.**

## 단일 책임 원칙

 적절한 분리가 가져오는 특징은 객체지향 설계 원칙 중 하나인 단일 책임 원칙<sup>Single Responsibility Principle</sup>으로 설명할 수 있다. 단일 책임 원칙은 하나의 모듈은 한 가지 책임을 가져야 한다는 의미다.

 트랜잭션 서비스의 추상화 방식을 통해 DI한다면, UserService가 바뀔 이유는 사용자 관리 로직이 변경되는 한가지 뿐이다. 설령 트랜잭션 기술이 바뀌거나 서버환경이 바뀌더라도 UserService를 변경할 이유가 없다.

 이렇게 단일 책임 원칙을 지키는 코드를 작성하면, 어떤 변경이 필요할 때 수정 대상이 명확해지는 장점이 있다. 의존성이 존재하는 코드라면 의존 수 만큼 엄청난 코드를 수정해야 한다. 많은 코드를 수정하는 작업에선 그만큼 실수가 일어날 확률이 높다.

 때문에 적절히 책임과 관심이 다른 코드를 분리하고, 서로 영향을 주지 않도록 하는 작업은 갈수록 복잡해지는 엔터프라이즈 어플리케이션에는 반드시 필요하다. 좋은 코드를 설계하고 만들려면 꾸준한 노력이 필요하다. 그저 기능이 동작한다고 해서 코드에 쉽게 만족하지 말고 계속 다듬고 개선하려는 자세도 필요하다. DI 또한 좋은 코드를 만들려고 고민했던 시간을 통해 만들어진 것이다. 스프링의 의존관계 주입 기술인 DI는 좋은 설계와 코드를 만드는 모든 스프링 기술의 기반이 되는 핵심 기술이다.
