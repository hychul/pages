audit은 의심가는 데이터베이스의 작업을 모니터링 하고, 기록 정보를 수집 하는 기능 입니다. 어느시간때에 어떤 작업들이 주로 발생하는지, 어떤 작업을 누가 하는지 추적 할 수 있습니다. audit 작업을 하면, audit 로그를 기록해야 하므로 시스템의 속도는 더 느려질 수 있습니다.

# JPA를 사용하기

JPA는 audit 기능을 기본적으로 제공하진 않습니다. 하지만 엔티티의 생명주기 이벤트를 통해 audit 기능을 수행할 수 있습니다.

## `@PrePersist`, `@PreUpdate` 그리고 `@PreRemove`

JPA의 엔티티 클래스는 엔티티의 생명주기의 이벤트에 따라 콜백 메서드를 호출합니다. 여기서 쿼리가 호출되기 전에 호출되는 콜백에서 audit 기능을 구현하기 위해 `@PrePersist`, `@PreUpdate` 그리고 `@PreRemove` 어노테이션을 사용할 수 있습니다.

```java
@Entity
public class Bar {    
    @PrePersist
    public void onPrePersist() { ... }
       
    @PreUpdate
    public void onPreUpdate() { ... }
       
    @PreRemove
    public void onPreRemove() { ... }   
}
```

각 콜백 메서드는 리턴 타입이 `void`여야 하고 메서드에 파라메터가 없어야합니다. 어떤 이름이나 접근 제한자를 갖는지는 상관없지만 `static` 메서드면 안됩니다.

## 콜백 메서드로 audit 구현

```java
@Entity
public class Bar {
    @Column(name = "operation")
    private String operation;
      
    @Column(name = "timestamp")
    private OffsetDateTime timestamp;

    ... standard setters and getters for the new properties
    
    @PrePersist
    public void onPrePersist() {
        audit("INSERT");
    }
      
    @PreUpdate
    public void onPreUpdate() {
        audit("UPDATE");
    }
      
    @PreRemove
    public void onPreRemove() {
        audit("DELETE");
    }
      
    private void audit(String operation) {
        setOperation(operation);
        setTimestamp(OffsetDateTime.now());
    }
}
```

위는 한 엔티티에 대한 audit을 구현한 예시입니다. 하지만 여러 JPA 엔티티에 audit을 효율적으로 적용하기 위해선, 엔티티의 라이프 사이클 이벤트에 따라 특정 작업을 수행하는 `@EntityListeners` 어노테이션을 사용할 수 있습니다.

## `@EntityListeners`로 audit 구현

```java
@EntityListeners(AuditListener.class)
@Entity
public class Bar { ... }

public class AuditListener {
    @PrePersist
    @PreUpdate
    @PreRemove
    private void beforeAnyOperation(Object object) { ... }  
}
```

# Hibernate Envers 사용하기

`@Audited` 어노테이션은 Hibernate Envers에서 제공하는, JPA에서 기본적으로 제공하진 않지만 이를 사용하면 JPA와 연동하여 손쉽게 audit 기능을 수행할 수 있습니다.

## Envers 시작하기

Envers를 사용하기 위해선 gradle에 Hibernate Envers의 의존성을 추가하고 `@Audited` 어노테이션을 엔티티 클래스에 적용하면 됩니다. 

```gradle
dependencies {
    ...
    // Hibernate Envers
    compile("org.hibernate:hibernate-envers:${hibernate}")
    ...
}
```
```java
@Entity
@Audited
public class Bar { ... }
```
만약 Bar가 Foo 엔티티와 일대 다 관계<sup>One To Many</sup>에 있다면 Foo에서 @Audited를 추가하거나 Foo에서 Bar의 관계에 `@NotAudited`를 설정하여 Foo를 audit 해야합니다.

```java
@Entity
@Audited
public class Bar {
    ...
    @OneToMany(mappedBy = "bar")
    @NotAudited
    private Set<Foo> fooSet;
    ...
}
```

# Spring Data JPA 사용하기

Spring Data JPA는 JPA를 확장하여 제공하는 프레임워크로 Spring에서 JPA를 사용하기 위한 다양한 기능을 제공합니다. Spring Data는 자동으로 구현을 제공하며 audit 기능 또한 제공합니다.

## JPA Auditing 설정하기

먼저 Apring Data JPA에서 제공하는 audit 기능을 사용하기 위해선 `@Configuration` 어노테이션이 설정된 클래스에 `@EnableJpaAuditing` 어노테이션을 설정해야합니다.

```java
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories
@EnableJpaAuditing
public class PersistenceConfig { ... }
```

## Spring의 auditing 이벤트 콜백 리스너 설정하기

앞서 언급했듯이 JPA는 `@EntityListeners` 어노테이션을 통해 특정 콜백 리스너를 지정할 수 있습니다. Spring Data JPA는 audit을 위한 `AuditingEntityListener`를 제공합니다. 이 리스너를 설정하면 audit 정보를 이벤트 리스너를 통해 추적할 수 있습니다.

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Bar { ... }
```

## 생성 시간과 수정 시간 추적하기

생성 된 시간과 마지막으로 수정 한 시간을 엔터티에 저장하기위한 두 개의 새 속성을 추가합니다. 각 프로퍼티는 `@CreatedDate` 및 `@LastModifiedDate` 어노테이션에 의해 자동으로 추적됩니다.

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Bar {
    ...
    @Column(name = "created_date", nullable = false, updatable = false)
    @CreatedDate
    private long createdDate;
 
    @Column(name = "modified_date")
    @LastModifiedDate
    private long modifiedDate;
    ...
}
```

## Spring Security와 함께 사용하기

Spring Security를 함께 사용하는 경우 생성 시간과 수정 시간 뿐만 아니라 누가 수정했는지도 추적할 수 있습니다.

```java
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Bar {
    ...
    @Column(name = "created_by")
    @CreatedBy
    private String createdBy;
 
    @Column(name = "modified_by")
    @LastModifiedBy
    private String modifiedBy;
    ...  
}
```

`@CreatedBy` 및 `@LastModifiedBy` 어노테이션이 설정된 된 프로퍼티는 엔티티를 만들거나 마지막으로 수정 한 주체의 이름으로 채워집니다. 이 주체의 이름은 SecurityContext의 Authentication 인스턴스에서 가져옵니다. 주체의 이름을 설정된 값을 직접 정의하려면 `AuditorAware<T>` 인터페이스를 구현한 후 @EnableJpaAuditing의 auditorAwareRef 매개 변수 값으로 Bean의 이름을 지정하면 됩니다.

```java
@EnableJpaAuditing(auditorAwareRef="auditorProvider")
public class PersistenceConfig {
    ...
    @Bean
    AuditorAware<String> auditorProvider() {
        return new AuditorAwareImpl();
    }
    ...
}

public class AuditorAwareImpl implements AuditorAware<String> {
    @Override
    public String getCurrentAuditor() {
        // custom logic
    }
}
```

[원글 링크](https://www.baeldung.com/database-auditing-jpa)