Spring Boot 2.X와 JPA를 사용하는 프로젝트에 `@Audited` 어노테이션을 사용하기 위해서 Hibernate Envers 의존성을 추가하고 빌드를 할 때 아래와 같은 에러가 발생했다.

`org.hibernate.internal.util.config.ConfigurationException: Unable to build hbm.xml JAXBContext`

결국 JAXB 관련 라이브러리가 없어서 발생하는 문제인데 아래의 의존성을 추가하여 해결할 수 있다.

```gradle
    compile('javax.xml.bind:jaxb-api:2.3.0')
    compile('javax.activation:activation:1.1')
    compile('org.glassfish.jaxb:jaxb-runtime:2.3.0')
```