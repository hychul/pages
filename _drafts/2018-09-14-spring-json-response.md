---

---

 

스프링  ViewResolver가 어떻게 페이지 또는 JSON을 통해 응답하는가

클래스를 Json으로 변환하는 라이브러리 사용 ([Jackson vs Gson](https://www.baeldung.com/jackson-vs-gson))



@ResponseBody 사용하기

 컨트롤러 메소드에 `@RequestMapping`과 함께 스프링 3.0에 추가된 `@ResponseBody` 로 어노테이션을 붙이면 메소드에서 리턴되는 값은 View 를 통해서 출력되지 않고, `MessageConverter`에 의해 데이터 타입에 따라 변환이 이뤄진 후 HTTP Response Body 에 직접 쓰여지게 된다.

오브젝트를 받을 땐 `@RequestBody` 어노테이션을 파라메터에 사용해 객체 형태로 요청을 받을 수 있다.

MessageConverter 의 종류

\- StringHttpMessageConverter

\- FormHttpMessageConverter

\- ByteArrayMessageConverter

\- MarshallingHttpMessageConverter

\- MappingJacksonHttpMessageConverter

http://ismydream.tistory.com/140

http://devbox.tistory.com/entry/Spring-RequestBody-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98%EA%B3%BC-ReponseBody-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98%EC%9D%98-%EC%82%AC%EC%9A%A9



@RestController 사용하기

 스프링 4.0부터 추가된 `RestController` 어노테이션을 컨트롤러 클래스에 사용하면  `@ResponseBody`를 사용하지 않고 객체를  Json 형식으로 자동으로 파싱해준다. 4.0에서 Jackson 라이브러리가 기본적으로 포함되기 때문에 Jackson 라이브러리도 따로 추가해줄 필요가 없다.

요청은 `@ResponseBody`와 같이 `@RequestBody` 어노테이션을 통해 객체 형식으로 받을 수 있다.

https://blog.naver.com/writer0713/220699582907



http://highcode.tistory.com/24



https://wckhg89.github.io/archivers/understanding_jackson





스프링 RequestBody 설정 순서

1. WebMvcConfigurationSupport.mvcUriComponentsContributer()
   - `@Bean`을 사용하는 메서드로 
2. WebMvcConfigurationSupport.requestMappingHandlerAdapter()
   - `@Bean`을 사용하는 메서드로 `@Requestbody`와 `@ResponseBody` 어노테이션을 사용하는 메서드에 사용되는 어드바이스에 `JsonViewRequestBodyAdvice`와 `JsonViewResponseBodyAdvice`를 
3. RequestMappingHandlerAdapter.setRequestBodyAdvice(List\<RequestBodyAdvice>)
4. RequestMappingHandlerAdapter.setResponseBodyAdvice(List<ResponseBodyAdvice<?>>



스프링 Request 2 Response 순서

1. DispatcherServlet(FraneworkServlet).processRequest(HttpServletRequest, HttpServletResponse)
   - `FrameworkServlet`에서 자신을 상속받는 서블릿이 요청을 처리하도록 `doService()` 메서드를 호출한다.
2. DispatcherServlet.doService(HttpServletRequest, HttpServletResponse)
   - request 오브젝트를 프레임워크가 핸들러 및 뷰 객체에서 사용할 수있게 필요 어트리뷰트를 추가한다. snapshot 오브젝트를 만들어 로직을 수행 후 기존 어트리뷰트로 restore 시킨다.
3. DispatcherServlet.doDispatch(HttpServletRequest, HttpServletResponse)
   - 맵핑되어 있는 적절한 핸들러를 찾고 해당 핸들러를 지원하는 핸들러 어댑터에 request, response 객체와 핸들러 메서드를 `handle()` 메서드에 넘겨준다.
4. RequestMappingHanlderAdapter(AbstractHandlerMethodAdapter).handle(HttpsServletRequest, HttpServletResponse, Object)
   - `AbstractHandlerMethodAdapter`를 상속받는 어댑터가 요청을 처리하도록 `handleInternal()` 메서드를 호출한다.
5. RequestMappingHanlderAdapter.handlerInternal(HttpsServletRequest, HttpServletResponse, HandlerMethod)
   - 동기화가 필요한지 체크한 후 `invokeHanlderMethod()` 메서드를 호출한다.
6. RequestMappingHanlderAdapter.invokeHandlerMethod(HttpsServletRequest, HttpServletResponse, HandlerMethod)
   - request, response 객체를 묶어 `ServletWebRequest`와 `ModelAndViewContainer` 객체를 생성하고 `HandlerMethod`를 `ServletInvocableHandlerMethod`로 변환하여 핸들러 메서드를 실행한다.
7. ServletInvocableHandlerMethod.invokeAndHandle(ServletWebRequest, ModelAndViewContainer, Object...)
   - `invokeForRequest()` 메서드를 통해 핸들러의 로직을 수행한 후 **(이 때 argumentResolver 수행)** 요청에 대한 리턴 값을 `HandlerMethodReturnValueHandlerComposite` 클래스에서 처리하도록 한다.
8. HandlerMethodReturnValueHandlerComposite.handleReturnValue(Object, MethodParameter, ModelAndViewContainer, NativeWebRequest)
   - `selectHanlder()` 메서드를 통해 얻은 핸들러로 리턴 타입에 맞게 ModelAndViewContainer를 세팅한다.
9. HandlerMethodReturnValueHandlerConposite.selectHandler(Object, MethodParameter)
   - 리턴 타입에 맞는 적절한 핸들러를 찾는다.



참조 : 

https://www.baeldung.com/servlet-json-response