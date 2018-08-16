---
title: 스프링과 MVC
date: 2018-08-15
categories:
- Spring
tags:
- Development
- Spring
- Server
- Java
---

![mvc-0](https://user-images.githubusercontent.com/18159012/44155597-b4ca4fd6-a0e8-11e8-8cf5-861138aa990f.png)

 MVC 패턴은 사용자와 상호작용하는 소프트웨어를 Model, View 그리고 Controller의 세가지 컴포넌트로 나눠 디자인하는 것을 말한다. 이 패턴을 사용하면 각 요소들이 서로에게 영향을 주지 않게 개발하여 복잡성을 줄일 수 있다.

## Model

어플리케이션의 정보, 데이터를 담는 컴포넌트를 의미한다.

## View

MVC에서 Model은 여러 개의 View를 가질 수 있다. Model에게서 데이터가 갱신되었다는 이벤트를 받아 View가 업데이트 된다.

## Controller

사용자 입력을 받아 적절한 비지니스 로직을 호출하고 그 결과를 사용자 인터페이스로 반환하는 역할을 한다.

MVC는 웹페이지를 동적으로 표현하기 위해 사용된 JSP부터 현재의 스프링까지 기술의 발전과 함께 그 구조를 달리하며 적용되어왔다. 

# MVC 모델1

JSP는 html 내에 자바 코드를 삽입하도록 하여 동적으로 웹 브라우저를 관리하는 언어이다. View를 표현하는 html과 Model과 Controller를 담당하는 자바 코드가 JSP 안에서 함께 작성되기 때문에 MVC의 각 컴포넌트의 분리를 통한 효과를 보기 힘들었다.

![mvc](https://user-images.githubusercontent.com/18159012/44191985-9d263e00-a168-11e8-8fcb-0325387a2501.png)

때문에 JSP는 JavaBean을 사용하여 사용하여 데이터베이스에 접근하는 모델을 분리하였고, 이를 MVP1 패턴으로 표현한다.

![mvc-02](https://user-images.githubusercontent.com/18159012/44192209-8af8cf80-a169-11e8-8b70-8bd6fbb57c9a.png)

## 특징

- 개발 속도가 빠르다.
- 프레젠테이션과 비즈니스 로직이 혼재하여 가독성이 떨어진다.

# MVC 모델2

모델 2에선 각 컴포넌트가 혼재되는 JSP와 html 표현 방법이 불편한 Servlet을 함께 사용하여 View와 Controller를 분리하였다.![mvc-03](https://user-images.githubusercontent.com/18159012/44193270-42431580-a16d-11e8-8a97-9d0e7f82f7d8.png)

## 특징

- 처리 영역의 분리를 통해 유지보수와 확장성이 용이하다.
- 구조 설계를 위한 시간이 많이 소요된다.

# JSP와 Servlet의 작동

모델 1과 모델 2에서 Controller의 역할을 담당하는 것은 각각 JSP와 Servlet이다. 하지만 재미있는 점은 실제 작동될 때 두 모델 모두 결과적으론 Servlet을 통해 Request를 처리한다는 점이다.

~~애초에 Servlet이 많은 줄을 갖는 html을 표현하는데 불편하기 때문에 이를 보완하기 위해 JSP가 등장했다.~~ 

## Servlet

Servlet은 Servlet Container에 의해 관리된다. 어플리케이션이 클라이언트의 요청을 받았을 때, 요청에 해당하는 서블릿을 찾아 작업을 수행한 후 클라이언트에 응답을 하는 과정이 Servlet Container에 의해 동작한다.

![mvc-04](https://user-images.githubusercontent.com/18159012/44194708-cbf4e200-a171-11e8-9239-bff8870e2141.png)

서블릿 컨테이너는 URL패턴과 서블릿을 매핑하는 배포 서술자<sup>DD:Deployment Descriptor</sup>(web.xml)를 사용하여 요청에 맞는 서블릿을 찾아 요청에 대한 처리를 위한 스레드를 생성해준다. 대표적인 Servlet Container로 tomcat이 있다.

### 동작 순서

1. 웹서버로 부터 요청이 들어오면 제일 먼저 컨테이너가 이를 전달 받는다.
2. 컨테이너는 배포서술자(web.xml)를 참조하여 해당 서블릿을 찾는다.
3. 서블릿이 존재하면 스레드 풀을 사용하여 서블릿을 위한 스레드를 생성하다.
4. httpServletRequest(요청)과 httpServeletResponse(응답) 객체를 생성하여 서블릿에 전달한다.
5. 다음으로 컨테이너는 서블릿의 service() 메서드를 호출하고, service() 메서드에서 요청에 따라 doPost() 또는 doGet()을 호출한다.
6. 호출된 doPost() 또는 doGet() 메소드는 생성된 동적페이지를 httpServeletResponse객체에 실어서 컨테이너에 전달한다. 
7. 컨테이너는 전달받은 httpServeletResponse객체를 HTTPResponse형태로 전환하여 웹서버에 전달하고 생성되었던 스레드를 종료하고 httpServletRequest 및 httpServeletResponse 객체를 소멸시킨다. 

## JSP

앞서 JSP 또한 Servlet을 통해 처리된다고 했다. JSP를 Servlet 클래스로 변환하는 역할을 Servlet Conteiner의 JSP 엔진이 담당한다.

![mvc-05](https://user-images.githubusercontent.com/18159012/44197419-7c1a1900-a179-11e8-8b2e-80f571b2e99a.png)

변환된 Servlet 파일(.java)엔 JSP에서 작성된 자바 코드가 service() 메서드안에 존재하기 때문에 자바로 작성된 로직을 수행가능하다. 또한 html 코드들은  String으로 변환되어 페이지에 출력되게 된다.

### 동작

1. JSP 페이지로 부터 요청을 받는다.
2. JSP 엔진에 의해 JSP 파일이 파싱된다.
3. JSP에 대응하는 Servlet이 존재하지 않는 경우 Servlet 파일(.java)로 변환된다.
4. 변환된 Servlet 파일이 자바 컴파일러에 의해 클래스 파일(.class)로 컴파일된다.
5. 컴파일 된 후 Servlet 클래스의 service() 메서드를 호출하고 요청을 처리한다.

# 스프링의 MVC

서블릿을 통한 웹 어플리케이션 개발에서 모든 서블릿에 대해 URL 매핑을 위해 배포 서술자인 web.xml에 모두 등록해주어야 했다. 하지만 스프링에서는 DispatcherServlet을 통해 배포 서술자의 역할을 축소시켰다. DispatcherServlet에서 어플리케이션의 요청을 적절한 Controller에게 전달하기 때문이다.

## DispatcherServlet



![mvc-06](https://user-images.githubusercontent.com/18159012/44198198-ba183c80-a17b-11e8-8054-40625d19bbf4.png)

### 동작

1. 클라이언트의 요청을 DispatcherServlet이 전달받는다.
2. HandlerMapping을 통해 전달 받은 요청을 매핑한 Controller가 있는지 검색한다.
3. Controller를 찾은 경우 Controller가 요청을 처리하고 결과를 출력할 View의 이름 혹은 ModelAndView 객체를 리턴한다.
4. View의 이름을 사용하여 ViewResolver를 통해 View를 검색한다.
5. Controller의 처리 결과를 View에 전달한다.
6. 처리 결과가 포함된 View를 DispatcherServlet에 전달한다.
7. 요청에 대한 응답을 클라이언트에게 전달한다.

### static  파일 처리

DispatcherServlet이 모든 요청을 처리하면 이미지나 정적 html 파일을 불러오는 요청마저 컨트롤러로 전달하게 된다. 이런 경우 자원을 제대로 불러오지 못하는 문제가 동반된다.

스프링에선 이러한 상황을 피하기 위해 \<mvc:resources> 태그를 사용해 web.xml에 정적 파일에 대한 정보를 2차적으로 기술하도록 하였다. DispatcherServlet에 요청에 대한 Controller를 찾지 못하는 경우 2차적으로 설정된 경로를 검색하여 해당 자원을 찾도록 한다.