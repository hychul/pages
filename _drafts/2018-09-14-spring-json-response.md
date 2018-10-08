---

---



스프링  ViewResolver가 어떻게 페이지 또는 JSON을 통해 응답하는가

클래스를 Json으로 변환하는 라이브러리 사용 ([Jackson vs Gson](https://www.baeldung.com/jackson-vs-gson))



@ResponseBody 사용하기

컨트롤러 메소드에 `@RequestMapping`과 함께 `@ResponseBody` 로 어노테이션을 붙이면 메소드에서 리턴되는 값은 View 를 통해서 출력되지 않고, `MessageConverter`에 의해 데이터 타입에 따라 변환이 이뤄진 후 HTTP Response Body 에 직접 쓰여지게 된다. 

MessageConverter 의 종류

\- StringHttpMessageConverter

\- FormHttpMessageConverter

\- ByteArrayMessageConverter

\- MarshallingHttpMessageConverter

\- MappingJacksonHttpMessageConverter

http://ismydream.tistory.com/140



참조 : 

https://www.baeldung.com/servlet-json-response