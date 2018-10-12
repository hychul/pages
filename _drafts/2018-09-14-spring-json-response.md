---

---

 

 스프링 MVC를 통해 웹 어플리케이션을 구현하여 request를 받은 경우 Service를 통해 로직을 수행한 후 Controller에서  ViewResolver를 통해 이에 해당하는 View를 찾아 프론트엔드에 전달한다. 하지만 Restful한 어플리케이션의 경우 View가 아닌 Json 포맷의 데이터를 Response 값으로 사용한다.



클래스를 Json으로 변환하는 라이브러리 사용 ([Jackson vs Gson](https://www.baeldung.com/jackson-vs-gson))



# @ResponseBody 사용하기

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



# @RestController 사용하기

 스프링 4.0부터 추가된 `RestController` 어노테이션을 컨트롤러 클래스에 사용하면  `@ResponseBody`를 사용하지 않고 객체를  Json 형식으로 자동으로 파싱해준다. 4.0에서 Jackson 라이브러리가 기본적으로 포함되기 때문에 Jackson 라이브러리도 따로 추가해줄 필요가 없다.

요청은 `@ResponseBody`와 같이 `@RequestBody` 어노테이션을 통해 객체 형식으로 받을 수 있다.

https://blog.naver.com/writer0713/220699582907



http://highcode.tistory.com/24



https://wckhg89.github.io/archivers/understanding_jackson





# 스프링 MessageConverter 설정 순서

1. WebMvcConfigurationSupport.mvcUriComponentsContributer()
   - `@Bean`을 사용하는 메서드로 
2. WebMvcConfigurationSupport.requestMappingHandlerAdapter()
   - `@Bean`을 사용하는 메서드로 `@Requestbody`와 `@ResponseBody` 어노테이션을 사용하는 메서드에 사용되는 어드바이스에 `JsonViewRequestBodyAdvice`와 `JsonViewResponseBodyAdvice`를 추가한다.
3. RequestMappingHandlerAdapter.setRequestBodyAdvice(List\<RequestBodyAdvice>)
4. RequestMappingHandlerAdapter.setResponseBodyAdvice(List<ResponseBodyAdvice<?>>
5. RequestMappingHanlderAdapter.afterPropertiesSet()
   - 프로퍼티가 설정되고 호출되며 `initControllerAdviceCache()`와 `getDefaultArgumentResolvers()` 메서드를 호출한다.
6. RequestMappingHanlderAdapter.initControllerAdviceCache()
   - RequestBodyAdvice와 ResponseBodyAdvice 빈을 검색하여 requestResponseBodyAdvice에 추가한다.
7. RequestMappingHanlderAdapter.getDefaultArgumentResolvers()
   - requestResponseBodyAdvice에 대해 메세지 컨버터를 적용한 리졸버를 생성한다.

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter
		implements BeanFactoryAware, InitializingBean {
    // ...
        
    @Override
	public void afterPropertiesSet() {
		// Do this first, it may add ResponseBody advice beans
		initControllerAdviceCache();

		if (this.argumentResolvers == null) {
			List<HandlerMethodArgumentResolver> resolvers = getDefaultArgumentResolvers();
			this.argumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);
		}
		if (this.initBinderArgumentResolvers == null) {
			List<HandlerMethodArgumentResolver> resolvers = getDefaultInitBinderArgumentResolvers();
			this.initBinderArgumentResolvers = new HandlerMethodArgumentResolverComposite().addResolvers(resolvers);
		}
		if (this.returnValueHandlers == null) {
			List<HandlerMethodReturnValueHandler> handlers = getDefaultReturnValueHandlers();
			this.returnValueHandlers = new HandlerMethodReturnValueHandlerComposite().addHandlers(handlers);
		}
    }
    
	// ...
    
	private List<HandlerMethodReturnValueHandler> getDefaultReturnValueHandlers() {
		List<HandlerMethodReturnValueHandler> handlers = new ArrayList<HandlerMethodReturnValueHandler>();
		// ...
		// Annotation-based return value types
		handlers.add(new ModelAttributeMethodProcessor(false));
		handlers.add(new RequestResponseBodyMethodProcessor(getMessageConverters(),
				this.contentNegotiationManager, this.requestResponseBodyAdvice));
        // ...
		return handlers;
	}
    
    // ...
        
	@Override
	protected ModelAndView handleInternal(HttpServletRequest request,
			HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {

		ModelAndView mav;
		checkRequest(request);
		// ...
        mav = invokeHandlerMethod(request, response, handlerMethod);
		// ...
		return mav;
	}
    
    // ...
    
    protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
			HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {

		ServletWebRequest webRequest = new ServletWebRequest(request, response);
		try {
            // ...
			ModelAndViewContainer mavContainer = new ModelAndViewContainer();
			// ...
			invocableMethod.invokeAndHandle(webRequest, mavContainer);
			if (asyncManager.isConcurrentHandlingStarted()) {
				return null;
			}

			return getModelAndView(mavContainer, modelFactory, webRequest);
		}
		finally {
			webRequest.requestCompleted();
		}
	}
}

public class ServletInvocableHandlerMethod extends InvocableHandlerMethod {
    //...
    public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {

		Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
		setResponseStatus(webRequest);

		if (returnValue == null) {
			if (isRequestNotModified(webRequest) || getResponseStatus() != null || mavContainer.isRequestHandled()) {
				mavContainer.setRequestHandled(true);
				return;
			}
		}
		else if (StringUtils.hasText(getResponseStatusReason())) {
			mavContainer.setRequestHandled(true);
			return;
		}

		mavContainer.setRequestHandled(false);
		try {
			this.returnValueHandlers.handleReturnValue(
					returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
		}
		catch (Exception ex) {
			if (logger.isTraceEnabled()) {
				logger.trace(getReturnValueHandlingErrorMessage("Error handling return value", returnValue), ex);
			}
			throw ex;
		}
	}
	// ...
}
```



# 스프링 Request Handle 순서

 @ResponseBody 메서드를 통해 Json 데이터를 Response 값으로 통신하는 컨트롤러 클래스의 메서드를 호출할때 Stack Trace를 통해 호출 메서드 로그를 출력하면 다음과 같다.

```term
- DispatcherServlet(FraneworkServlet).processRequest(HttpServletRequest, HttpServletResponse)
- DispatcherServlet.doService(HttpServletRequest, HttpServletResponse)
- DispatcherServlet.doDispatch(HttpServletRequest, HttpServletResponse)
- RequestMappingHanlderAdapter(AbstractHandlerMethodAdapter).handle(HttpsServletRequest, HttpServletResponse, Object)
- RequestMappingHanlderAdapter.handleInternal(HttpsServletRequest, HttpServletResponse, HandlerMethod)
- RequestMappingHanlderAdapter.invokeHandlerMethod(HttpsServletRequest, HttpServletResponse, HandlerMethod)
- ServletInvocableHandlerMethod.invokeAndHandle(ServletWebRequest, ModelAndViewContainer, Object...)
- HandlerMethodReturnValueHandlerComposite.handleReturnValue(Object, MethodParameter, ModelAndViewContainer, NativeWebRequest)
- HandlerMethodReturnValueHandlerComposite.selectHandler(Object, MethodParameter)
- RequestResponseBodyMethodProcessor.supportsReturnType(MethodParameter)
```

 `org.springframeworkLspring-webmvc` 패키지의 클래스를 참고하여 호출된 메서드의 구현부를 따라가다 보면  `RequestMappingHanlderAdapter.hanlder()` 메서드에서 `ModelAndView`를 `DispathcerServlet`에 리턴하는 것을 확인 할 수 있다.

 `RequestMappingHanlderAdapter.invokeHanlderMethod()` 메서드에서 `HandlerMethod`를 `ServletInvocableHandlerMethod`로 변환하고 `invokeAndHandle()` 메서드를 호출한다.

```java
public class RequestMappingHandlerAdapter extends AbstractHandlerMethodAdapter
		implements BeanFactoryAware, InitializingBean {
	// ...
	protected ModelAndView invokeHandlerMethod(HttpServletRequest request,
			HttpServletResponse response, HandlerMethod handlerMethod) throws Exception {
		ServletWebRequest webRequest = new ServletWebRequest(request, response);
		try {
			// ...
			ModelFactory modelFactory = getModelFactory(handlerMethod, binderFactory);
			// ...
			ServletInvocableHandlerMethod invocableMethod = createInvocableHandlerMethod(handlerMethod);
			invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);
			invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);
			// ...
			ModelAndViewContainer mavContainer = new ModelAndViewContainer();
			// ...
			invocableMethod.invokeAndHandle(webRequest, mavContainer);
			// ...
			return getModelAndview(mavContainer, modelFactory, webRequest);
		}
		finally {
			webRequest.requestCompleted();
		}
	}
	// ...
}
```

 `ServletInvocableHandlerMethod.invokeAndHandle()` 메서드에서 핸들러 메서드를 invoke한 후 `RequestMappingHanlderAdapter`에서 전달받은 `returnValueHanlder`를 통해 핸들러 메서드의 리턴 값을 핸들링한다. 이 때, `@ResponseBody` 어노테이션이 사용된 핸들러 메서드라면 MessageConverter를 사용해 리턴 값을 Json 포맷으로 변환한다.





1. void DispatcherServlet(FraneworkServlet).processRequest(HttpServletRequest, HttpServletResponse)
   - `FrameworkServlet`에서 자신을 상속받는 서블릿이 요청을 처리하도록 `doService()` 메서드를 호출한다.
2. void DispatcherServlet.doService(HttpServletRequest, HttpServletResponse)
   - request 오브젝트를 프레임워크가 핸들러 및 뷰 객체에서 사용할 수있게 필요 어트리뷰트를 추가한다. snapshot 오브젝트를 만들어 로직을 수행 후 기존 어트리뷰트로 restore 시킨다.
3. void DispatcherServlet.doDispatch(HttpServletRequest, HttpServletResponse)
   - 맵핑되어 있는 적절한 핸들러를 찾고 해당 핸들러를 지원하는 핸들러 어댑터에 request, response 객체와 핸들러 메서드를 `handle()` 메서드에 넘겨준다.
4. ModelAndView RequestMappingHanlderAdapter(AbstractHandlerMethodAdapter).handle(HttpsServletRequest, HttpServletResponse, Object)
   - `AbstractHandlerMethodAdapter`를 상속받는 어댑터가 요청을 처리하도록 `handleInternal()` 메서드를 호출한다.
5. RequestMappingHanlderAdapter.handleInternal(HttpsServletRequest, HttpServletResponse, HandlerMethod)
   - 동기화가 필요한지 체크한 후 `invokeHanlderMethod()` 메서드를 호출한다.
6. **RequestMappingHanlderAdapter.invokeHandlerMethod(HttpsServletRequest, HttpServletResponse, HandlerMethod)**
   - request, response 객체를 묶어 `ServletWebRequest`와 `ModelAndViewContainer` 객체를 생성하고 `HandlerMethod`를 `ServletInvocableHandlerMethod`로 변환하여 핸들러 메서드를 실행한다.
7. ServletInvocableHandlerMethod.invokeAndHandle(ServletWebRequest, ModelAndViewContainer, Object...)
   - `invokeForRequest()` 메서드를 통해 핸들러의 로직을 수행한 후 **(이 때 argumentResolver 수행)** 요청에 대한 리턴 값을 `HandlerMethodReturnValueHandlerComposite` 클래스에서 처리하도록 한다.
8. HandlerMethodReturnValueHandlerComposite.handleReturnValue(Object, MethodParameter, ModelAndViewContainer, NativeWebRequest)
   - `selectHanlder()` 메서드를 통해 얻은 핸들러로 리턴 타입에 맞게 ModelAndViewContainer를 세팅한다.
9. HandlerMethodReturnValueHandlerConposite.selectHandler(Object, MethodParameter)
   - 리턴 타입에 맞는 적절한 핸들러를 찾는다.



참조 : 

https://www.baeldung.com/servlet-json-response