WebClient를 사용해서 여러개의 String 값을 응답으로 받는 api를 처리할 때, 분명 보내는 쪽에선 응답 값이 없는데도 불구하고 받아서 처리하는 쪽에서 비어있는 값을 나타내는 Json 표현식인 '[]'을 하나의 아이템으로 받아들여 Flux<String> 스트림에 "[]"을 넘겨주는 이슈가 있었다.

불필요한 값을 아이템으로 인식하는 것을 막기 위해 `filter(it -> !"[]".equals(it))` 을 추가하여 처리하도록 했다. 다른 곳에서 데이터를 받아 처리할 떄 String인 경우 정해진 형식으로 필터링 하도록 하는 것도 괜찮은 방법인 것 같다.

```java
    return webClient.get()
                    .uri(uriComponent.toUriString())
                    .retrieve()
                    .bodyToFlux(String.class)
                    .filter(it -> !"[]".equals(it));
```
