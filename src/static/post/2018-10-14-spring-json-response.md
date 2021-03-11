스프링 MVC를 통해 웹 어플리케이션을 구현하여 request를 받은 경우 Service를 통해 로직을 수행한 후 컨트롤러<sup>Controller</sup>에서  뷰 리졸버<sup>View Resolver</sup>를 통해 이에 해당하는 뷰<sup>View</sup>를 찾아 프론트엔드에 전달한다. 하지만 restful한 어플리케이션의 경우 뷰가 아닌 Json 포맷의 데이터를 response 값으로 사용할 수 있다. 스프링에서 Json 포맷을 response로 사용하기 위한 방법을 알아본다.

# Json 데이터 response로 사용하기

## response 객체에 Json 문자열 담기

 가장 직관적인 방법은 HttpServletResponse를 핸들러 메서드의 파라메터로 받아 직접 Json 문자열을 response 객체에 세팅하는 것이다.

```java
@Controller
@RequestMapping("/test")
public class TestController {
    @RequestMapping(value = "/json", method = RequestMethod.GET)
    public void getStringJson(HttpServletResponse response)  {
        String testJson;
        TestModel testModel = new TestModel("Success");

        testJson = "{\"message\":\"" + testModel.getMessage() + ""\"}"
            
        try {
            response.getWriter().print(personJson);
        } catch (IOException e) {
            e.printStackTrace();
        }   
    }
}
```

 직접 response에 Json 데이터를 설정하면 직관적으로 알 수 있지만 직접 json으로 파싱하는 구문을 작성해야하는 번거로움이 있다. 자동으로 Json을 파싱하기 위해 `ObjectMapper` 클래스를 사용할 수 있다.

```java
@Controller
@RequestMapping("/test")
public class TestController {
    @RequestMapping(value = "/json", method = RequestMethod.GET)
    public void getStringJson(HttpServletResponse response)  {
        ObjectMapper mapper = new ObjectMapper();
        
        TestModel testModel = new TestModel("Success");
            
        try {
            response.getWriter().print(mapper.writeValueAsString(testModel));
        } catch (IOException e) {
            e.printStackTrace();
        }   
    }
}
```

 직접 Json으로 변환하는 번거로움은 줄었지만 Json를 리턴하는 핸들러 메서드가 많을 경우 중복된 코드가 많아지게 된다.

## @ResponseBody 사용하기

 `ObjectMapper` 클래스의 사용을 AOP를 통해서 제거할 수 있지만 스프링 3.0 부터 Json 데이터 포맷을 response로 지원하기 위해 `@ResponseBody` 어노테이션이 추가되었다.

 다음은 뷰와 Json을 각각 response로 사용하는 컨트롤러의 예제이다.

```java
@Controller
@RequestMapping("/test")
public class TestController {
    @RequestMapping(value = "/view", method = RequestMethod.GET)
    public String getView(ModelMap model) {
        TestModel testModel = new TestModel("Success");
        
        model.addAttribute("model", testModel);
        
        return "test";
    }
    
    @RequestMapping(value = "/json", method = RequestMethod.GET)
    @ResponseBody
    public TestModel getJson() {
        TestModel testModel = new TestModel("Success");
        
        return testModel;
    }
    
    // @RequestBody 어노테이션도 @ResponseBody와 함께 3.0 버전에 추가되었다.
    @RequestMapping(value = "/json", method = RequestMethod.POST)
    @ResponseBody
    public TestModel getJson(@RequestBody TestModel testModel) {
        TestModel testModel = new TestModel(testModel.getMessage());
        
        return testModel;
    }
}
```

## @RestController 사용하기

 스프링 4.0부터 추가된 `RestController` 어노테이션을 컨트롤러 클래스에 사용하면  `@ResponseBody`를 사용하지 않고도 `MessageConverter`를 통해 객체를  Json 형식으로 자동으로 파싱해준다. 4.0에서 Jackson 라이브러리가 기본적으로 포함되기 때문에 Jackson 라이브러리도 따로 추가해줄 필요가 없다.

```java
@RestController
@RequestMapping("/test")
public class TestController {
    @RequestMapping(value = "/json", method = RequestMethod.GET)
    public TestModel getJson() {
        TestModel testModel = new TestModel("Success");
        
        return testModel;
    }
    
    @RequestMapping(value = "/json", method = RequestMethod.POST)
    public TestModel getJson(@RequestBody TestModel testModel) {
        TestModel testModel = new TestModel(testModel.getMessage());
        
        return testModel;
    }
}
```

# 스프링의 Json response

 Json을 response로 사용하기 위해 스프링에서 제공하는 방법은 앞에서 본 것과 같이 아주 간단하다. 일반적으로 스프링 MVC에서 컨트롤러의 핸들러 메서드를 통해 request를 처리하는 방식은 아래 그림과 같이 뷰 리졸버를 사용하여 뷰를 리턴하는 방식으로 작동한다.

![spring-json-response-0](https://user-images.githubusercontent.com/18159012/46917394-b0874580-d001-11e8-888d-8882c1c39c38.png)

 하지만 핸들러 메소드에 `@RequestMapping`과 함께 `@ResponseBody` 어노테이션을 붙이면 메소드에서 리턴되는 값은 뷰 리졸버가 아닌, `MessageConverter`에 의해 데이터 타입에 따라 변환이 이뤄진 후 HTTP Response Body 에 직접 쓰여지게 된다.

![spring-json-response-1](https://user-images.githubusercontent.com/18159012/46917399-b8df8080-d001-11e8-9018-782246324813.png)

> MessageConverter 의 종류
>
> \- StringHttpMessageConverter
>
> \- FormHttpMessageConverter
>
> \- ByteArrayMessageConverter
>
> \- MarshallingHttpMessageConverter
>
> \- MappingJacksonHttpMessageConverter

## Request 핸들링

 @ResponseBody 메서드를 통해 Json 데이터를 Response 값으로 통신하는 컨트롤러 클래스의 메서드 호출 스택을 출력하면 다음과 같다.

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

 `ServletInvocableHandlerMethod.invokeAndHandle()` 메서드에서 핸들러 메서드를 invoke한 후 `RequestMappingHanlderAdapter`에서 전달받은 `returnValueHandler`를 통해 핸들러 메서드의 리턴 값을 핸들링한다. 이 때, `@ResponseBody` 어노테이션이 사용된 핸들러 메서드라면 `MessageConverter`를 사용해 리턴 값을 Json 포맷으로 변환한다.

```java
public class ServletInvocableHandlerMethod extends InvocableHandlerMethod {
    // ...
	public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer,
			Object... providedArgs) throws Exception {
		Object returnValue = invokeForRequest(webRequest, mavContainer, providedArgs);
        // ...
        this.returnValueHandlers.handleReturnValue(
					returnValue, getReturnValueType(returnValue), mavContainer, webRequest);
        // ...
	}
    // ...
}
```

 `returnValueHandler`는 스프링 MVC가 설정파일을 통해 초기화 된 후 `RequestMappingHanlderAdapter`의 `afterPropertiesSet()` 메서드가 호출되면서 세팅되는데, return value handler에 `@RequestBody`와 `@ResponseBody` 어노테이션이 붙은 핸들러를 지원하는 `RequestResponseBodyMethodProcessor`가 스프링 MVC에서 기본값으로 지원된다.

 `@RestController`가 컨트롤러에 설정된 경우에도 위에 설명한 방식으로 동작한다. 그 이유는 `@RestController`의 선언부에서 찾아볼 수 있다.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController {

	/**
	 * The value may indicate a suggestion for a logical component name,
	 * to be turned into a Spring bean in case of an autodetected component.
	 * @return the suggested component name, if any
	 * @since 4.0.1
	 */
	String value() default "";

}
```

 `@RestController`는 `@Controller`와 `@ResponseBody` 어노테이션을 합친 어노테이션이다. 때문에 `@RestController`가 컨트롤러에 설정되어 있다면 `@ResponseBody` 어노테이션을 사용하지 않아도 Json 데이터를 response로 사용할 수 있다.



참조 : 

[@RequestBody와 @ReponseBody 어노테이션의 사용](http://devbox.tistory.com/entry/Spring-RequestBody-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98%EA%B3%BC-ReponseBody-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98%EC%9D%98-%EC%82%AC%EC%9A%A9)