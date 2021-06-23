게이트웨이 프로젝트에서 다른 서비스가 배포 등의 이유로 응답을 못하는 경우 "connection refused" 에러가 발생하였다.

기존 MVC의 경우 Ribbon으로 관리되어 배포를 하더라도 이런식으로 게이트 웨이에 영향을 주는 경우는 없었지만, Webflux 기반의 Spring Cloud Gateway로 변환한 후 발생하는 문제였다.

# Solution

`LoadBalancerCacheAutoConfiguration` 에서 기본적으로 `DefaultLoadBalancerCacheManager` 클래스를 통해 클래스를 생성한다. 해당 클래스를 사용하여 클라이언트 로드 밸런서가 로드 밸런스 인스턴스를 캐시하여 사용한다.

`DefaultLoadBalancerCacheManager` 클래스가 초기화 될 때 캐시를 설정하게 되는데, 이때 `LoadBalancerCacheProperties` 의 `ttl`<sup>time to live</sup> 프로퍼티를 사용하여 캐시가 만료되는 기간을 설정한다.

문제는 기본 값이 30초로 되어있기 때문에, 만약 다른 서비스가 배포 등의 이유로 해당 서비스의 서버가 응답을 하지 못하는 경우 다른 서버로 요청을 보내지 못하고 30초 동안 응답을 하지 못하는 서버로 계속 요청을 보내어 connection refuse가 발생하게 된다.

때문에 리액티브 로드 밸런서 등의 사용을 위해 Ribbon을 사용하지 않는 경우 해당 설정의 값을 낮춰 사용하는 것이 좋다. 현재 팀에서 3초로 설정하여 응답을 하지 못하는 경우의 캐시가 바뀌어 동작할 수 있도록 설정되어 있다.

```yml
spring:
  cloud:
    loadbalancer:
      ribbon:
        enabled: false
      cache:
        ttl: 3s
```
