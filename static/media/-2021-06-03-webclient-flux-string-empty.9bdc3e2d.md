다른 서비스에 WebClient를 통해 요청을 한 후 [] 문자열을 리스폰스로 받아서 처리하여 Flux를 통해 처리하는 경우 [] 문자열 자체가 하나의 아이템으로 사용되어 버림 `Flux<String>` 그래서 `filter(it -> !"[]".equals(it))` 으로 처리함
