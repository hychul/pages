기본적으로 자바에서 프레임워크를 사용하는 것 이외에 데이터베이스에 접근하기 위해선 JDBC를 사용해야한다. 하지만 JPA를 사용하면 JDBC등을 굳이 사용하지 않고 간편하게 데이터베이스의 데이터를 자바 오브젝트로 관리할 수 있는데, 어떻게 이게 가능한 것일까?

# JPA는 기술 명세에 불과하다

JPA<sup>Java Persistence API</sup>는 이름 그대로 자바의 [Persistence API](https://jcp.org/en/jsr/detail?id=338) 그리고 영속성<sup>Persistence</sup>과 관련이 있는다. 간단히 설명하자면 자바 어플리케이션에서 RDBMS를 어떻게 사용하는지 정의한 하나의 방법이다. 

영속성은 데이터를 생성한 어플리케이션이 종료되어도 사라지지 않는 데이터의 특성을 의미한다. 모든 자바 오브젝트가 영속성을 가질 필요는 없지만, 대부분의 어플리케이션은 주요 비즈니스와 관련된 데이터를 데이터베이스에 저장하여 영속성을 부여한다. JPA를 사용하면 데이터베이스의 오브젝트를 자바 어플리케이션에서 영속성을 부여할 수 있다.

JPA는 앞서 말한 것과 같이 단순 명세이기 때문에 구현이 자바 자체에 존재하지 않는다. JPA를 정의한 `javax.persistence` 패키지의 대부분은 `interface`, `enum` `Exception` 그리고 각종 `Annotation` 으로 이루어져 있다. 예를들어 `EntityManager`의 경우 아래와 같은 `interface`로 정의되어있다.

```java
package javax.persistence;

import ...

public interface EntityManager {

    public void persist(Object entity);

    public <T> T merge(T entity);

    public void remove(Object entity);

    public <T> T find(Class<T> entityClass, Object primaryKey);

    ...
}
```

JPA의 ORM<sup>Object-relational mapping</sup> 모델은 원래 Hibernate에 기반하여 현재까지 발전되엇다. 이처럼 원래 RDBMS을 지원하기 위해 개발된 JPA는 현재 NoSQL도 사용할 수 있도록 확장되었다.

> ### 영속성<sup>Persistence</sup>
> 
> 영속성이란 데이터를 생성한 프로그램이 종료되어도 사라지지 않는 데이터의 특성을 의미한다.
>
> 영속성을 갖지 않으면 데이터는 메모리에서만 존재하게 되고 프로그램이 종료되면 해당 데이터는 모두 사라지게 된지만, 데이터를 파일이나 데이터베이스에 저장함으로써 데이터에 영속성을 부여할 수 있다.

# Hibernate는 JPA의 구현체이다

JPA가 Hibernate를 기반했기 때문에 이 둘이 자주 혼동되지만, JPA는 호환 가능한 많은 프레임워크를 생성했고 Hibernate는 그 중 하나에 불과하다. 때문에 JPA를 사용하기 위해서 반드시 Hibernate를 사용해야하는 것은 아니다.

Hibernate는 2002년 초에 개발된 ORM 라이브러리로, Gavin King에 의해 persistence bean을 대체하기 위해 개발되었다. 이 프레임워크는 대중적이었기 때문에 첫 JPA 규격에 채택되고 개발되엇다. 오늘날의 Hibernate ORM은 가장 완성도 높은 JPA 구현 중 하나이며 여전히 자바 ORM으로써 널리 사용되고 있다.

실제로 JPA의 `EntityManagerFactory`, `EntityManager`, `EntityTransaction`을 Hibernate에서 `SessionFactory`, `Session`, `Transaction` interface 로 상속받고 그 구현체를 갖고있다.

# 자바 ORM이란?

동작에는 차이가 있지만 모든 JPA 구현은 ORM 레이어에 제공된다. ORM은 개발자가 수동으로 맵핑할 필요없이 데이터 베이스의 테이블과 컬럼을 자바 오브젝트로 변환하여 저장되고 관리될 수 있도록 한다.

자바 어플리케이션의 오브젝트를 데이터베이스에 업데이트하기 위해선 SQL문을 작성해야되는데 ORM은 테이블과 오브젝트를 매핑함으로써 자동으로 SQL문을 생성하고 동작한다.

데이터베이스에 대한 접근이 필요하기 때문에 JPA도 JDBC API을 사용한다. 자바 어플리케이션에서 ORM을 통해 데이터베이스에 접근하면 Hibernate와 같은 JPA Provider는 내부 적으로 JBDC API를 사용하여 SQL 문을 생성하고 데이터베이스와 통신한다. 덕분에 개발자가 직접 JDBC API를 호출하지 않게 되는 것이다.

![how-jpa-works-02](https://user-images.githubusercontent.com/18159012/115114072-57c90700-9fc8-11eb-9d30-d549fce099f6.jpg)

이와같이 ORM을 통해서 맴핑된 자바 오브젝트를 엔티티<sup>Entity</sup>라고 부른다.

# Persistence Layer

아키텍처에서 데이터에 영속성을 부여하는 계층을 의미한다.

JDBC를 이용하여 직접 구현이 가능하지만 보통은 Persistence 프레임워크를 사용한다.

![java-persistence-0](https://user-images.githubusercontent.com/18159012/115113324-bab89f00-9fc4-11eb-98e3-a6dd5bef324a.jpg)

> ### Persistence 프레임워크
> 
> JDBC를 직접 사용할 필요없이 프레임워크를 사용하여 데이터베이스와 연동되는 시스템을 개발할 수 있도록 도와준다. 크게 SQL Mapper와 ORM으로 나눌 수 있다.

# 영속성 컨텍스트<sup>Persistence Context</sup>

JPA의 핵심은 엔티티가 영속성 컨텍스트<sup>Persistence Context</sup>에 포함되어 있냐 아니냐로 나뉜다. JPA의 EntityManager가 활성된 상태로 같은 트랜젝션 안에서 엔티티를 사용하면 그 엔티티는 영속성 컨텍스트에서 관리된다.

![java-persistence-1](https://user-images.githubusercontent.com/18159012/115113794-053b1b00-9fc7-11eb-8921-3435d4388ecd.jpg)
