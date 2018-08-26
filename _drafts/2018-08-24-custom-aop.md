---
title: Custom AOP
date: 2018-08-24
categories:
- Spring
tags:
- Development
- Spring
- AOP
- Java
---

 앞서 게시한 "[DI와 AOP](https://hychul.github.io/spring/2018/08/16/di-and-aop/)"에서 AOP의 목적과 주요 개념에 대해 알아보았다. 스프링을 통해 사용하여 직접 Custom Aspect를 구현하여 AOP를 적용할 수 있다.

# 어노테이션을 이용한 AOP

클래스 선언에 @Aspect 어노테이션을 통해 Aspect 클래스임을 나타낼수 있다. 클래스에 @Component 어노테이션을 통해 빈으로 등록하고 메서드에 @Before, @After, @AfterReturning, @Around 그리고 @AfterThrowing 어노테이션을 통해 시점마다 Advise를 구현할 수 있다. 

하지만 Advise만 기술한다면 아무 메서드가 실행될 때마다 의도하지 않는 Advise가 실행될 것이다. 때문에 어떤 메서드에서 Advise가 실행될지 필터링을 하기위한 Pointcut을 설정해야한다.

## Pointcut 기술 방법<sup>Description</sup>

메서드 어노테이션 괄호 안에는 포인트 컷에 대한 내용을 기술하여 Advise가 실행될 지 필터링을 할 수 있다.

### execution

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

### within

특정 패키지에 속하는 메서드(조인포인트)로 제한한다.

```java
"within(com.hychul.example.service.UserService)"
"within(com.hychul.example.service..*)"
```

### bean

특정 `bean`에 속하는 메서드로 제한한다.

```java
"bean(UserService)"
"bean(*Service)"
```

### this

특정 클래스 혹은 인터페이스를 상속받는 클래스에 속하는 메서드(조인포인트)로 제한한다.

```java
"this(com.example.service.BaseService)"
```

### target

특정 클래스 혹은 인터페이스를 상속받는 인스턴스의 메서드를 호출하는 메서드(조인포인트)로 제한한다.

```java
"target(com.example.service.TargetService)"
```

### args

매칭할 조인포인트를 아규먼트가 전달한 타입의 인스턴스인 경우로 제한한다.

```java
"args(java.io.Serializable)"
"args(java.io.Serializable,..)"
```

#### 주의

위의 args 예시는 `"execution(* *(java.io.Serializable,..))`과 같지 않다. args의 경우 런타임시 전달된 아규먼트가 Serializable일 경우 매칭되고, execution의 경우 메서드 시그니쳐가 Serilaizable의 파라메터를 선언한 경우에 매칭된다.

### @target

매칭할 조인포인트에서 호출하는 메서드의 클래스에 특정 어노테이션이 붙어있는 경우로 제한한다.

```java
@target(com.hychul.example.annotation.TargetAnnotation)
```

### @within

매칭할 조인포인트에 특정 어노테이션이 붙어있는 경우로 제한한다.

매칭할 조인포인트를 전달한 어노테이션이 붙은 타입으로 제한한다. (스프링 AOP를 사용할 때 전달한 어노테이션이 붙은 타입에 선언된 메서드의 실행)

### @annotation

매칭할 조인 포인트에 특정 어노테이션이 붙어있는 경우로 제한한다.

```java
@annotation(com.hychul.example.annotation.ExampleAnnotation)
```

### @args

매칭할 조인포인트(스프링 AOP를 사용하는 경우 메서드의 실행)를 전달된 실제 아규먼트의 런타임 타입이 전달한 타입의 어노테이션이 붙어있는 경우로 제한한다.

https://blog.outsider.ne.kr/843

https://www.baeldung.com/spring-aop

https://www.baeldung.com/spring-aop-pointcut-tutorial

https://www.baeldung.com/spring-aop-annotation

# 예시

```java
@Aspect
@Component
public class ExampleAspect {
    
    @PointCut("within(@org.springframework.stereotype.Repository *)")
    public void repositoryClassMethods() {}
    
    @Before("repositoryClassMethods()")
    public void before() {
        ...
    }
    
    @After("execution(* findProduct(String))")
    public void After() {
        ...
    }
    
    @AfterReturning("@annotation()", returning = "ret")
    public void afterReturning(String ret) {
        ...
    }
    ...
}
```



### JavaConfig를 이용한 AOP

Java Config에 사용하는 @EnableAspectJAutoProxy 어노테이션에 proxyTargetClass 옵션이 있다. 이 옵션을 true로 지정하면 CGLib Proxy를 사용할 수 있다.

```java
@Configuration
@EnableAspectJAutoProxy(proxyTargetClass=true)
public class ExampleConfig {
	...
```

### Bean 정의 파일을 이용한 AOP

이제 마지막으로 설명할 부분은 왜 action-servlet.xml과 context-aspect.xml 두 곳에서 AOP를 설정했는지에 대한 것이다.

이는 Application Context의 계층구조와 연관이 되어 있다. 

지금 우리의 프로젝트는 2개의 컨텍스트가 설정이 되어있다. 

하나는 action-servlet.xml이고 다른 하나는 context-*.xml 파일이 그것인데, 이는 각각 Root Application Context, Servlet Context의 설정파일이다.

두개의 차이점은 다음과 같다.

### Root Application Context

\- 최상단 컨텍스트 

\- 서로 다른 서블릿 컨텍스트에서 공유하는 bean을 등록 

\- 웹에서 사용되는 컨트롤러 등을 등록

\- 서블릿 컨텍스트에서 등록된 bean을 사용할 수 없으며, 서블릿 컨텍스트와 루트 컨텍스트에서 동일한 bean을 설정할 경우, 서블릿 컨텍스트에서 설정한 bean만 동작

### Servlet Context

\- 서블릿에서 이용되는 컨텍스트

\- 여기서 정의된 bean은 다른 서블릿 컨텍스트와 공유할 수 없음

따라서 Controller와 관련된 bean은 action-servlet.xml에 설정하고, Service, DAO, Component등은 context-*에 설정하게 된다.

SpringMVC 개발에서는 이렇게 설정하는것이 원칙이다. 

우리가 설정한 AOP를 보면 Controller, Service, DAO의 3개 영역에서 모두 사용이 되어야 하는데, 한쪽의 컨텍스트에서만 설정하게 되면 다른 컨텍스트에서는 동작하지 않게 된다. 

예를 들어 action-servlet.xml에만 설정을 하면 Controller의 로그만 출력될 것이고, context-aspect.xml에서만 설정하면 Service, DAO에서만 로그가 출력이 될 것이다.

사실 이 글 전에 action-servlet.xml에서만 Component-scan을 했었는데, 이는 잘못된 방법이다. 

그렇지만 이번에 AOP를 설정하면서 같이 이야기를 하기 위해서 놔뒀었다. 

이번글에서 두가지 컨텍스트에 대해서 이야기를 하면서 왜 잘못되었고, 어떻게 해야하는지도 같이 살펴보게 되었다.

출처: http://addio3305.tistory.com/86

인터넷에 AOP에 대해 나와있는 내용 중 상당수가 설명이 부족한 경우가 있습니다.

특히 Controller에 AOP가 적용이 안된다거나 (사실 보통 Controller에는 AOP를 적용하지 않습니다. Interceptor가 있기 때문이죠. 그렇지만 어쩔수없이 Controller에도 AOP를 적용해야 할 수도 있기 때문에 여기서는 같이 설명을 하겠습니다.) 스프링의 다른 기능과 충돌이 나는 경우가 있습니다.

출처: http://addio3305.tistory.com/86