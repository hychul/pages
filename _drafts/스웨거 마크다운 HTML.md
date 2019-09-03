```java

    public static String getSwaggerHtml() throws Exception {
        final URL remoteSwaggerFile = new URL("http://localhost:8080/v2/api-docs");

        final List<Extension> extensions = Arrays.asList(AutolinkExtension.create(),
                                                         StrikethroughExtension.create(),
                                                         HeadingAnchorExtension.create(),
                                                         TablesExtension.create(),
                                                         InsExtension.create());
        final Parser parser = Parser.builder()
                                    .extensions(extensions)
                                    .build();
        final Node document = parser.parse(Swagger2MarkupConverter.from(remoteSwaggerFile)
                                                                  .withConfig(new Swagger2MarkupConfigBuilder().withMarkupLanguage(
                                                                          MarkupLanguage.MARKDOWN).build())
                                                                  .build()
                                                                  .toString());
        final HtmlRenderer renderer = HtmlRenderer.builder()
                                                  .extensions(extensions)
                                                  .build();

        return renderer.render(document);
    }
```

http://swagger2markup.github.io/swagger2markup/1.3.1/
https://github.com/atlassian/commonmark-java