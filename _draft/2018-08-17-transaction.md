---
title: 스프링 트랜잭션
date: 2018-08-17
categories:
- Spring
tags:
- Development
- Spring
- Java
---



설정파일

```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
     <property name="dataSource" ref="dataSource"/>
</bean>
<tx:annotation-driven transaction-manager="transactionManager" proxy-target-class="true"/>
```



```java
@EnableTransactionManagement
public class AppConfig {
    ...
    @Bean
    public PlatformTransactionManager transactionManager() throws URISyntaxException, GeneralSecurityException, ParseException, IOException {
        return new DataSourceTransactionManager(dataSource());
    }
}
```



적용

```java
public class UserService{

  @Transactional
  public boolean insertUser(User user){
    ...
  }
}
```



주요속성

| 속성          | 설명                                                         | 예                                               |
| ------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| isolation     | Transaction의 isolation Level. 별도로 정의하지 않으면 DB의 Isolation Level을 따름. | @Transactional(isolation=Isolation.DEFAULT)      |
| propation     | 트랜잭션 전파규칙을 정의 , Default=REQURIED                  | @Transactional(propagation=Propagation.REQUIRED) |
| readOnly      | 해당 Transaction을 읽기 전용 모드로 처리 (Default = false)   | @Transactional(readOnly = true)                  |
| rollbackFor   | 정의된 Exception에 대해서는 rollback을 수행                  | @Transactional(rollbackFor=Exception.class)      |
| noRollbackFor | 정의된 Exception에 대해서는 rollback을 수행하지 않음.        | @Transactional(noRollbackFor=Exception.class)    |
| timeout       | 지정한 시간 내에 해당 메소드 수행이 완료되지 않은 경우 rollback 수행. -1일 경우 no timeout (Default = -1) | @Transactional(timeout=10)                       |

https://taetaetae.github.io/2017/01/08/transactional-setting-and-property/