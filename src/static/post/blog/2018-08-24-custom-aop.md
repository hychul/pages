앞서 게시한 "[DI와 AOP](https://hychul.github.io/spring/2018/08/16/di-and-aop/)"에서 AOP의 목적과 주요 개념에 대해 알아보았다. 스프링을 통해 사용하여 직접 Custom Aspect를 구현하여 AOP를 적용할 수 있다. 스프링에서 조인트 포인트<sup>Joint Point</sup>는 메서드의 실행시점을 의미하며, 포인트컷 표현을 사용하여 어떤 advise가 조인트 포인트에서 실행될지 필터링할 수 있다. 

# Pointcut 기술 방법<sup>Description</sup>

메서드 어노테이션 괄호 안에는 포인트 컷에 대한 내용을 기술하여 Advise가 실행될 지 필터링을 할 수 있다.

## execution

실행 메서드( 조인포인트)를 위한 것으로 스프링 AOP를 사용할 때 주로 사용되는 포인트컷 지정자이다.

- "execution((\[메서드 수식어]) \[메서드 반환값] \[메서드] (throws \[예외]))"

| 요소 | 메서드 수식어 | 메서드 반환값           | 메서드                                                       | throws 예외 |
| :--: | ------------- | ----------------------- | ------------------------------------------------------------ | ----------- |
| 설명 | 생략가능      | 와일드 카드(*) 사용가능 | 와일드 카드(*) 사용 가능<br />패키지.클래스 또는 인터페이스를 메서드 앞에 서술 가능<br />복수의 패키지 혹은 메서드 인수를 ".."를 사용해 표현 | 생략가능    |

```java
"execution(public * com.hychul.example.service.UserService(String,..))"
"execution(public * com.hychul.example.service..*(..))"
"execution(* *(..))"
```

## within

특정 패키지, 클래스 혹은 인터페이스에 속하는 메서드(조인포인트)로 제한한다.

```java
"within(com.hychul.example.service.UserService)"
"within(com.hychul.example.service..*)"
```

## bean

특정 `bean`에 속하는 메서드로 제한한다.

```java
"bean(UserService)"
"bean(*Service)"
```

## this

특정 클래스 혹은 인터페이스를 상속받는 클래스에 속하는 메서드(조인포인트)로 제한한다.

```java
"this(com.example.service.BaseService)"
```

## target

특정 클래스 혹은 인터페이스를 상속받는 인스턴스의 메서드를 호출하는 메서드(조인포인트)로 제한한다.

```java
"target(com.example.service.TargetService)"
```

## args

매칭할 조인포인트의 아규먼트가 전달한 타입의 인스턴스인 경우로 제한한다.

```java
"args(java.io.Serializable)"
"args(java.io.Serializable, ..)"
```

### 주의

위의 args 예시는 `"execution(* *(java.io.Serializable,..))`과 같지 않다. args의 경우 런타임시 전달된 아규먼트가 Serializable일 경우 매칭되고, execution의 경우 메서드 시그니쳐가 Serilaizable의 파라메터를 선언한 경우에 매칭된다.

## @target

매칭할 조인포인트에서 호출하는 메서드의 런타임 클래스가 특정 어노테이션이 붙어있는 클래스인경우로 제한한다.

```java
@target(com.hychul.example.annotation.TargetAnnotation)
```

## @within

매칭할 조인포인트의 클래스에 특정 어노테이션이 붙어있는 경우로 제한한다.

```java
@target(com.hychul.example.annotation.TargetAnnotation)
```

## @annotation

매칭할 조인 포인트에 특정 어노테이션이 붙어있는 경우로 제한한다.

```java
@annotation(com.hychul.example.annotation.ExampleAnnotation)
```

## @args

매칭할 조인포인트의 아규먼트에 어노테이션이 붙어있는 경우로 제한한다.	

```java
@arg(com.hychul.example.annotation.ExampleAnnotation)
@arg(com.hychul.example.annotation.ExampleAnnotation, ..)
```

# 어노테이션을 이용한 AOP

클래스 선언에 @Aspect 어노테이션을 통해 Aspect 클래스임을 나타낼수 있다. 클래스에 @Component 어노테이션을 통해 빈으로 등록하고 메서드에 @Before, @After, @AfterReturning, @Around 그리고 @AfterThrowing 어노테이션을 통해 시점마다 Advise를 구현할 수 있다. 

하지만 Advise만 기술한다면 아무 메서드가 실행될 때마다 의도하지 않는 Advise가 실행될 것이다. 때문에 어떤 메서드에서 Advise가 실행될지 필터링을 하기위한 Pointcut을 설정해야한다. 어노테이션을 사용해서 AOP를 설정하기 위해서 먼저 클래스에 `@Aspect` 어노테이션을 설정해야한다. 포인트컷을 어노테이션을 통해 기술하기 위해 `@Pointcut` 어노테이션을 사용한다.

```java
@Aspect
@Component
public class ExampleAspect {
    
    @PointCut("within(org.springframework.stereotype.Repository)")
    public void repositoryClassMethods() {}
    
    ...
}
```

## Advise 기술 방법

Advise 시점에 따라 5가지 어노테이션을 통해 기술할 수 있다. `@Pointcut` 어노테이션을 통해 선언한 포인트컷 메서드를 사용하거나, 포인트컷 표현식을 사용하여 advise에 포인트컷을 함께 지정할 수 있다.

### @Before

```java
@Before("execution(* com.hychul.example.service..find*(..))")
public void foo() {
    ...
}

@Before("com.hcyhul.example.pointcut.anyPublicMethod() && @args(account, ..)")
public void beforeAccount(Account account) {
    ...
}
```

### @After

```java
@After("bean(UserService)")
public void foo() {
    ...
}
```

### @AfterReturning

```java
@AfterReturning(value = "within(org.springframework.data.jpa.repository)", returning="ret")
public void foo(User ret) {
    ...
}
```

### @Around

```java
@Around(@annotation(com.hychul.example.annoatation.ExampleAnnotation))
public void foo(ProceedJoinPoint pjp) {
    ...
}
```

### @AfterThrowing

```java
@AfterThrowing(value="com.hcyhul.example.pointcut.anyPublicMethod()", throwing="ex")
public void foo(SQLException ex) {
    ...
}
```

# JavaConfig를 이용한 AOP

Java Config에 사용하는 @EnableAspectJAutoProxy 어노테이션에 proxyTargetClass 옵션이 있다. 이 옵션을 true로 지정하면 CGLib Proxy를 사용할 수 있다.

```java
@Configuration
@EnableAspectJAutoProxy(proxyTargetClass=true)
public class ExampleConfig {
	
    @Bean
    public ExampleAspect exampleAspect() {
        return new exampleAspect();
    }
    
    ...
}
```

# Bean 정의 파일을 이용한 AOP

```xml
<aop:config>
    <aop:aspect id="exAspect" ref="exampleAspect">
        <aop:pointcut id="pc" expression="execution(* *..find*(..))"/>
        <aop:before pointcut-ref="pc" method="before"/>
        <aop:after pointcut-ref="pc" method="after"/>
        <aop:after-returning pointcut-ref="pc" method="afterReturning" returning="product"/>
        <aop:around pointcut-ref="pc" method="around"/>
        <aop:after-throwing pointcut-ref="pc" method="afterThrowing" throwing="ex"/>
    </aop:aspect>
</aop:config>
```

스프링에서 제공하는 advise를 사용하는 경우에는 `aop:advisor` 태그를 사용하여 advise를 정의한다.

```xml
<aop:config>
    <aop:advisor advise-ref="transactionAdvise" pointcut="execution(* *...*Service.*(..))"/>
</aop:config>
```

참조 : https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#aop-pointcuts