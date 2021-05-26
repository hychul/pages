스프링 클라우트 게이트웨이에서 보안 필터 설정중 분명히 `.httpBasic().disable()` 설정을 통해서 화면에 로그인 팝업을 띄우지 않게 설정했다고 생각을 했는데, 예상과 달리 계속해서 인증이 안된 리퀘스트에 대해서 로그인 창이 노출이 되었다.

![webflux-security-login-form-1](https://user-images.githubusercontent.com/18159012/118208993-b3d95b00-b4a2-11eb-9b64-16512a8b26db.png)

<!-- TODO : 원인 -->

disable 대신 httpBasic에 대한 `ServerAuthenticationEntryPoint`를 설정해야 한다.

```java
    ...
    return http.formLogin().disable()
               .httpBasic().authenticationEntryPoint(new HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
               .authenticationManager(authenticationManager)
    ...
```

<!-- https://stackoverflow.com/questions/63614553/spring-webflux-disabling-login -->


<!-- https://stackoverflow.com/questions/47354171/spring-webflux-custom-authentication-for-api -->