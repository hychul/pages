이제 마지막으로 설명할 부분은 왜 action-servlet.xml과 context-aspect.xml 두 곳에서 AOP를 설정했는지에 대한 것이다. 이는 Application Context의 계층구조와 연관이 되어 있다. 

지금 우리의 프로젝트는 2개의 컨텍스트가 설정이 되어있다. 

하나는 action-servlet.xml이고 다른 하나는 context-*.xml 파일이 그것인데, 이는 각각 Root Application Context, Servlet Context의 설정파일이다.

## Root Application Context

\- 최상단 컨텍스트 

\- 서로 다른 서블릿 컨텍스트에서 공유하는 bean을 등록 

\- 웹에서 사용되는 컨트롤러 등을 등록

\- 서블릿 컨텍스트에서 등록된 bean을 사용할 수 없으며, 서블릿 컨텍스트와 루트 컨텍스트에서 동일한 bean을 설정할 경우, 서블릿 컨텍스트에서 설정한 bean만 동작

## Servlet Context

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



# Spring Context에 관하여

우선 이전에 트랜잭션에 대해 공부하면서 작성했던 링크를 건다.

이 링크를 보면 트랜잭션 적용 도중에 제대로 동작이 안되는 이유가 컨텍스트의 관계 때문이라고 설명하고 있다.

http://blog.naver.com/writer0713/220579572336



오랜만에 다시 스프링 프로젝트 구조가 궁금해졌다. (정말 매번 공부할 때마다 새롭다..)

간단히 요약하자면 web.xml에서 ContextLoaderListener (root-context) 와 DispatcherServlet (servlet-context)을 생성하게 된다.

**root-context :** 이 컨텍스트에 등록되는 빈들은 모든 컨텍스트에서 사용되어 진다. (공유 가능)

**servlet-context :** 이 컨텍스트에 등록되는 빈들은 서블릿 컨텍스트에서만 사용되어 진다.

이게 무슨 말이냐하면,

보통 spring mvc 웹프로젝트를 생성하면 기본적으로 위 두개의 컨텍스트 + 기타 (mybatis, freemarker, etc) 컨텍스트를 생성하게 된다.

그리고 @Controller, @Service, @Repository 등의 어노테이션을 사용한 빈들을 사용하기 위해서는 어느 한 컨텍스트에 등록을 해줘야 한다.



**1. servlet-context 에 등록한다면 ?**

servlet-context.xml 에서 <context:component-scan ..> 을 사용하여 빈을 등록하게 되면 어떤 문제가 생길까?

위에 말했듯이 servlet-context에 등록된 빈들은 다른 컨텍스트와 공유를 할 수 없다고 했다.

그 말인즉슨, 필요에 따라 다른 컨텍스트를 생성하고 해당 컨텍스트에서 설정을 통하여 servlet-context에 등록되어진 빈에게 특정 기능을 사용한다고 해보자. (ex. transaction)

servlet-context에 등록된 빈은 공유가 되지 않기 때문에 다른 컨텍스트에서의 설정은 무용지물이 된다.



**2. root-context 에 등록한다면 ?**

위의 문제점을 결하기 위해선 모든 컨텍스트에서 공유가 되는 root-context에 빈을 등록해주면 된다.

그럼 모든 빈을 root-context 에 등록하면 되는거 아닌가?

물론 그래도 되겠지만, 꼭 공유될 필요가 없는 빈들은 용도에 따라 컨텍스트에 나눠 담는것이 가독성면에서나 성능면에서나 더 좋을것 같다.



참고 : 

> 기본적으로 스프링은 root-context 와 servlet-context가 생성되어지는데 root-context에서 생성되어진 빈들은 모든 컨텍스트에서 공유(사용) 할 수 있고
>
> 기타 다른 컨텍스트에서 생성되어진 빈들은 해당 컨텍스트에서만 사용되어질 수 있다.
>
> 그리고 root-context 와 servlet-context 에서 겹치는 빈이 생길 경우 servlet-context 의 빈을 사용하게 된다.
>
> 위 링크를 읽어 보면 알겠지만 설정은 여러가지 형태로 할 수 있다.
>
> 하지만 가장 이상적인 방법은 아래와 같이 빈을 생성하는 것이다.
>
>
>
> servlet-context : Controller
>
> root-context : Service, Repository 
>
>
>
> 이렇게 하면 컨트롤러에 대한 부분은 서블릿 컨텍스트에서만 책임지고 
>
> 나머지 Service, Repository는 root-context에서 생성한 것을 모든 컨텍스트에서 공유할 수 있게된다. (물론 각 컨텍스트에서 재 생성 가능하고, 그럴 경우 오버라이딩 된다.)
>
> **[출처]** [[spring\] context에 관하여](https://blog.naver.com/writer0713/220701612165)|**작성자** [Dreamy](https://blog.naver.com/writer0713)