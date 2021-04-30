JPA를 사용하다 보면 one-to-one, one-to-many 등의 한 엔티티에서 다른 엔티티와의 관계를 갖고 있을때, 페치 전략을 EAGER로 설정하고 `findAll()` 메서드를 통해서 조회하는 경우나, 패치 전략을 LAZY로 설정하고 조회한 엔티티와 관계를 갖는 하위 엔티티를 반복문을 통해서 조회하는 경우 전체를 조회하는 쿼리 이외에 하위 엔티티를 조회하는 쿼리가 더 발생하게 되는 N+1 문제를 접하게 된다. 

# N+1 이 발생하는 경우

## EAGER와 `findAll()`을 통해서 발생하는 N+1

```java
@Entity
public class A {
  @Id
  private Long id;

  @OneToOne // default EAGER
  private B b;
}

@Entity
public class B {
  @Id
  private Long id;
}
```

다음의 경우 A 엔티티를 `findById()` 메서드로 호출한 경우 join 쿼리를 통해서 문제없이 조회가 되지만, `findAll()`을 통해서 조회하는 경우 A 리스트를 조회하는 쿼리와 각각의 A가 자기가 갖고있는 B 엔티티를 조회하기 위해 쿼리가 각각 발생하게 된다.

## LAZY와 반복분을 통해서 발생하는 N+1

그렇다면 페치 전략을 LAZY로 설정했을 때 `findAll()` 메서드를 사용하면 어떨까?

```java
@Entity
public class A {
  @Id
  private Long id;

  @OneToMany // default LAZY
  private List<B> bList;
}

@Entity
public class B {
  @Id
  private Long id;
}
```

다음과 같은 관계를 갖는 엔티티가 있을때, A 엔티티를 `findAll()` 메서드를 통해서 조회하는 경우 B와의 페치 전략이 LAZY로 설정되어있기 때문에 A의 리스트를 조회하는 쿼리를 통해 가져오고 `List<B> bList` 의 경우 proxy의 형태로 존재하여 실제 사용하지 않으면 쿼리되지 않는다. 하지만 조회된 A의 리스트를 반복문을 통해서 접근하여 B 엔티티에 접근을 하게 되면 어떻게 될까?

```java
List<A> aList = aRepository.findAll(); // N+1이 발생하지 않음

List<B> bList;
for (A a : aList) {
  bList = a.getbList();
  log.info("b list size : {}", bList.size()); // N+1이 발생
}
```

`bList`를 사용할 때, 실제 엔티티를 가져오기 위해서 쿼리가 DB에서 B 엔티티를 조회하게 되고 각 A 리스트를 반복문을 통해서 B 엔티티를 조회하게 되기 때문에 각 반복문 블록마다 쿼리가 발생하게 된다.

<!-- TODO: Add new post -->
> 프록시는 언제 쿼리할까  
> https://victorydntmd.tistory.com/210  
> https://jyami.tistory.com/22  

## 양방향 관계에서의 N+1
<!-- https://wave1994.tistory.com/156 -->

위에서는 관계를 가지는 두 엔티티를 조회할때 모두 주엔티티(FK 컬럼을 갖는 엔티티)를 기준으로 조회하는 케이스를 확인했다. 그렇다면 JPA를 통해 종엔티티를 조회하는 경우엔 어떻게 동작하게 될까?

```java
@Entity
public class A {
  @Id
  private Long id;

  @OneToOne
  @JoinColumn(name = "b_id")
  private B b;
}

@Entity
public class B {
  @Id
  private Long id;

  @OneToOne(mappedBy = "b")
  private A a;
}
```

위와 같이 1 대 1 관계를 갖고 서로의 엔티티를 멤버 변수로 갖는 엔티티들은 `findById()` 메서드로 호출한 경우 앞서 설명한 것 처럼 join을 통해서 N+1 문제가 발생하지 않는다. 하지만 페치 전략을 LAZY로 설정한 경우에는 다르다.

```java
@Entity
public class A {
  @Id
  private Long id;

  @OneToOne
  @JoinColumn(fetch = FetchType.LAZY, name = "b_id")
  private B b;
}

@Entity
public class B {
  @Id
  private Long id;

  @OneToOne(fetch = FetchType.LAZY, mappedBy = "b")
  private A a;
}
```

다음과 같이 각각의 엔티티에서 페치 전략을 LAZY로 설정하고 `findById()` 메서드를 호출했을때, A 엔티티를 조회하는 경우엔 지연 로딩이 제대로 동작하여 A를 쿼리하고 B를 직접 사용할 때 프록시에 의해 B의 쿼리가 동작하게 된다. 하지만 B를 조회하는 경우엔 A를 사용하지 않더라도 A 엔티티에 대한 쿼리가 따로 실행되게 된다.

```java
  A a = aRepository.findById(A_ID).orElseThrow(NoSuchElementException::new);

  B b = bRepository.findById(B_ID).orElseThrow(NoSuchElementException::new); // N+1 발생
```

해당 이슈는 JPA의 구현체인 Hibernate에서 프록시 기능의 한계로 지연 로딩을 지원하지 못하기 떄문이다.

실제 DB에서 B 테이블은 FK 컬럼을 갖지 않기 때문에 A 엔티티와 관련된 컬럼이 존재하지 않는다.

| | id |
| - | - |
| 1 | 1 |
| 2 | 2 |
(B 테이블)

JPA의 구현체인 Hibernate에선 연관 객체값이 있는지 확인해야 하지만 B 테이블에는 A에 대한 컬럼이 존재하지 않기 때문에, 무조건 A를 조회해야 알 수 있다. 때문에 LAZY로 설정을 하더라도 지연 로딩이 제대로 동작하지 못한다.

A 엔티티에서 지연로딩이 제대로 동작하는 이유는 "b_id" 라는 컬럼이 존재하기 때문에 해당 컬럼을 확인하고 프록시 객체를 생성할 수 있기 때문이다.

| | id | b_id |
| - | - | - |
| 1 | 1 | 1 |
| 2 | 2 | 2 |
(A 테이블)

# 해결방법

## JPQL Join Fetch 사용하기

JPA 리포지토리의 메서드들은 메서드 이름을 통해서 JPQL이 생성되고 이를 사용하여 실제 DB의 SQL이 생성되어 쿼리가 실행된다. 하지만 JPQL은 메서드 이름 뿐만 아니라 `@Query` 어노테이션을 통해 직접 JPQL을 작성하여 쿼리할 수 있다. 이때 fetch join 키워드를 사용하면 join 대상을 함게 조회할 수 있다.

```java
interface ARepository extends JpaRepository<A, Long> {
  @Query("select a from A a left join fetch a.b where a.id = :id")
  A selectFetchJoin(@Param("id") Long id);
}
```

fetch join은 JPQL에서 성능 최적화를 위해 제공되는 기능이다. SQL에서도 join을 제공하지만 fetch join의 경우 연관된 단일 엔티티 뿐만 아니라 컬렉션도 조회가 가능하다. 

ref : https://docs.jboss.org/hibernate/orm/3.3/reference/en/html/queryhql.html#queryhql-joins

<!-- TODO:  -->
> Join Fetch가 동작하는 방법  
> https://stackoverflow.com/questions/17431312/what-is-the-difference-between-join-and-join-fetch-when-using-jpa-and-hibernate

## `@EntityGraph` 사용하기

`@EntityGraph` 어노테이션을 사용해서 문제를 해결할 수 있다. 해당 어노테이션의 attributePaths에 쿼리 수행시 바로 가져올 필드명을 지정하면 LAZY로 지정했더라도 EAGER로 조회하여 조인하여 가져오게 된다.

```java
interface ARepository extends JpaRepository<A, Long> {
  @EntityGraph(attributePaths = ["b"])
  @Query("select a from A")
  A findAllEntity(@Param("id") Long id);
}
```

<!-- TODO:  -->
> @EntityGraph가 동작하는 방법  
> 

## @BatchSize 와 즉시 로딩의 사용

`@BatchSize` 어노테이션을 통해 배치 사이즈를 지정하고 페치 타입을 EAGER 로 지정하면 `findAll()` 메서드를 사용하더라도 배치 사이즈 만큼 종엔티티를 조회해온다. 배치 사이즈를 넘어서 종엔티티를 사용하는 경우에는 추가로 조회하는 쿼리가 발생한다.

해당 방법은 페치 전략을 즉시 로딩으로 변경해야하고 배치 사이드 만큼만 조회하기 때문에 완벽하게 N+1 문제를 완벽하게 해결되지 않아 권장하는 방법은 아니다.

# 팁

## QueryBuilder를 사용하는 경우 OneToOne은 Fetch Join을 사용하는 것이 좋다
<!-- http://jaynewho.com/post/39 -->

```java
List<A> aList = jpaQueryFactory.select(qA).from(qA).fetch();
```

위의 코드에서 A의 멤버변수 B가 EAGER 페치 타입으로 지정이 되어있을때, join을 통해 한번에 조회하는 것을 기대할 수 있지만, 쿼리 빌더를 사용하면 A에 대한 쿼리만 실행되는 경우가 많다.

```sql
select
  a.id
from 
  a;
```

이렇게 쿼리가 실행되면 복수개의 A 엔티티가 영속성 컨텍스트로 로드될 때, EAGER로 설정된 B의 관계의 페치 타입이 동작하여 바로 N 개의 단일 B 엔티티 조회 쿼리가 실행되게 된다. (FetchType이 동작하는 시점은 영속성 컨텍스트로 로드될 떄)

따라서 쿼리 빌더를 통해 JPQL을 실행하는 경우, OneToOne 관계의 엔티티에 대해서 fetch join을 걸어주는 것이 좋다.

```java
List<A> aList = jpaQueryFactory.select(qA).from(qA).leftJoin(qB).fetchJoin().fetch();
```

# 기본 글로벌 페치 전략 기본값

| Relation Annotation | Default Fetch Type |
| - | - |
| `@OneToOne` | EAGER |
| `@ManyToOne` | EAGER |
| `@OneToMany` | LAZY |
| `@ManyToMany` | LAZY |

단일의 엔티티를 갖는 엔티티의 경우 해당 엔티티가 주인 엔티티가 되기 때문에 `findById()` 메서드를 통해서 쿼리할 때 join을 통해서 한번에 쿼리할 수 있기 때문에 기본적으로 EAGER로, 여러개의 엔티티를 갖는 관계의 경우 DB에서 FK를 갖는 주 엔티티가 될 수 없기 때문에 위해서 LAZY 전략을 기본값으로 사용하는 것 같다.