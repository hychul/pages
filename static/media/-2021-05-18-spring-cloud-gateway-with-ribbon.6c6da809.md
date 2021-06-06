스프링 클라우드 게이트 웨에서 라우트를 할 때 RouteLocator를 빈으로 등록해서 사용하거나 유레가 같은 discovery client를 사용하는 경우엔 discovery 옵션을 통해 사용하면 된다고 이전 []에서 설명했다.

Zuul 게이트웨이 기반에선 리본을 통해 라우팅될 서비스들을 관리하고 있었는데, SCG에서 이를 활용하기 위해 리본 설정(RibbonAutoConfiguration)을 통해 빈으로 등록되는 RibbonLoadBalancerClient의 사용을 피하고 

사실 해당 로드밸런서 클라이언트는 LoadBalancerClientFilter 에서 LoadBalancerClient.choose() 메서드를 통해서 GATEWAY_REQUEST_URL_ATTR 어트리뷰트를 통해서 로드 밸런싱된다.

<!-- https://springboot.cloud/26 -->

# DiscoveryClient를 사용하는 방법

SCG에서 `SimpleDiscoveryClient`를 제공한다. 해당 디스커버리 클라이언트는 설정파일(SimpleDiscoveryProperties)을 통해 인스턴스를 설정하고, 해당 인스턴스들은 라우팅될 때 `DiscoveryClientRouteDefinitionLocator`를 통해 서버 인스턴스를 라우트로 변환하여 반환하여 사용한다.

```yml
spring:
  cloud:
    discovery:
      client:
        simple:
          instances:
            service-a:
              - uri: http://service.a.com
            service-b:
              - uri: http://service.b.com
```

해당 방식을 통한 라우팅은 리본을 사용한 로드밸런싱과는 다르게 로드 밸런싱 없이 사용되기 때문에 내부적으로는 `Flux`를 사용하여 라우트를 넘겨주어 항상 동일한 인스턴스에 접근하지는 않겠지만, 그래도 여러대의 서버를 갖는 서비스에 접근할 때에는 사용을 지양해야될 것 같다.

# LoadBalancerClientFactory를 사용하는 방법