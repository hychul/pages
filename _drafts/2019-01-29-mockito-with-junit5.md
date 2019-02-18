---
title: Mockito with JUnit 5
date: 2019-01-29
categories:
- Development
tags:
- Development
- Java
- JUnit
- Mockito
---

overview

 JUnit 5에선 이전 버전에서 `@RunWith` 어노테이션을 사용했던 것과 다르게 `@ExtendWith` 어노테이션을 사용하여 확장 기능을 사용할 수 있다. Mockito 또한 `MockitoExtention` 클래스를 제공하여 JUnit 5환경에서 확장기능을 제공하도록 한다.

dependency

 Mockito의 JUnit 5 지원은 2.1.0 버전 부터 지원된다. 기존 

```groovy
dependencies {
    testCompile("org.mockito:mockito-core:2.23.0")
    testCompile("org.mockito:mockito-junit-jupiter:2.23.0")
}
```





https://www.baeldung.com/mockito-junit-5-extension

Mockito 2 릴리즈 노트 https://github.com/mockito/mockito/wiki/What%27s-new-in-Mockito-2