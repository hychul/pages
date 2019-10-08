PageableHandlerMethodArgumentResolver 를 등록하여 @RequestParam없이 Pageable 객체를 설정할 수 있음
@RequestBody도 필요하지 않음!

```java
    @Bean
    public WebMvcConfigurer adapter() {
        return new WebMvcConfigurer() {
            @Override
            public void addFormatters(FormatterRegistry registry) {
                registry.addConverter(new LocalDateConverter());
                registry.addConverter(new BreakdownConverter());
                registry.addConverter(new FilterConverter());
                registry.addConverter(new CollectionLongConverter());
                registry.addConverter(new CollectionStringConverter());
                registry.addConverter(new ReportLevelConverter());
                registry.addConverter(new IdTypeConverter());
                registry.addConverter(new ReportGraphStatisticsConverter());
            }

            @Override
            public void addInterceptors(InterceptorRegistry registry) {
                registry.addInterceptor(requestLogInterceptor()).excludePathPatterns("/monitor/l7check*");
            }

            @Override
            public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
                PageableHandlerMethodArgumentResolver resolver = new PageableHandlerMethodArgumentResolver();
                resolver.setOneIndexedParameters(true);
                argumentResolvers.add(resolver);
            }
        };
    }
```