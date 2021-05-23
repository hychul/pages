![git-version](https://img.shields.io/badge/Swagger2Markup-1.3.3-green.svg?style=flat-square)  

# Quick Usage

[Homebrea](https://brew.sh/)를 통해 필요한 모듈을 설치할 수 있습니다.

```terminal
$ brew install swagger2markup-cli
$ brew install asciidoc
$ brew install pandoc
```

Swagger API Document의 변환은 다음의 명령어를 통해 수행될 수 있습니다.

```terminal
$ swagger2markup convert -i ${source.json or url} -f {result}
$ asciidoc -b docbook {result}.adoc   
$ pandoc -f docbook -t markdown_strict {result}.xml -o {result}.md
$ pandoc -f docbook -t markdown_strict {result}.xml -o {result}.pdf
```

위의 명령어를 통해 Swagger json 혹은 url을 [Asciidoc](https://asciidoctor.org/docs/asciidoc-syntax-quick-reference/) 파일로 변환하고 변환된 Asciidoc 파일을 [DocBook](https://docbook.org/whatis)으로, 그리고 [Pandoc](https://pandoc.org/MANUAL.html)을 통해 다시 Markdown 파일로 변환합니다.

> Asciidoc's no output from filter WARNING message issue  
> `asciidoc -b` 명령어를 통해 문서를 변환할 때 'no output from filter WARNIG message' 라는 메세지가 출력이 될 수 있는데 이는 known issue로 무시하고 진행해도 됩니다.  

관련 링크 : http://discuss.asciidoctor.org/Improved-errors-reporting-td356.html  

# Swagger API Document

Swagger는 보통 작성된 어플리케이션의 API를 손쉽게 파악하거나 호출할 때 사용됩니다. 이는 swagger-ui 라이브러리에서 작성된 파일들을 사용하는데, Swagger가 지원 하는 가장 중요한 기능은 이것이 아니라 API document를 생성하는 것입니다.

## Document Generating Operation Process

Swagger의 컴포넌트들은 Spring의 `@Component` 어노테이션을 사용하며 Spring 빈의 생명주기를 따라 동작합니다.

Swagger에서 정의된 `DocumentationPluginsBootstrapper` 클래스에서 `Lifecycle.start()` 메서드를 상속하여 `ApiDocumentationScanner` 클래스를 사용하여 API와 그와 관련된 Model과 Property들을 스캔하여 API Document를 생성합니다.

Swagger 라이브러리에 정의된 `Swagger2Controller`를 보면 API document를 반환하는 GET api가 정의되어 있습니다. 정의된 GET api는 path가 "/v2/api-docs"로 설정 되어 있으며  API Document에 대한 json 값을 반환합니다.

"/swagger-ui.html" path로 접근하여 swagger-ui 라이브러리에서 제공하는 Swagger API document 뷰를 확인할 수 있는데, 개발자 모드로 호출한 api를 확인하면 "/v2/api-docs" path를 호출하는 것을 알 수 있습니다.

![swagger-api-document-file](https://user-images.githubusercontent.com/18159012/62447656-cfc5ae00-b7a0-11e9-9afb-b493c02439af.png)

# Swagger Annotation

Swagger에서 API Document를 생성할 때 기본적으로 작성되는 설명에 Swagger annotation을 사용하여 추가적인 설명을 덧붙일 수 있습니다. 

| Name | Description |
| -        | -      |
| `@Api` | Marks a class as a Swagger resource. |
| `@ApiImplicitParam` | Represents a single parameter in an API Operation. |
| `@ApiImplicitParams` | A wrapper to allow a list of multiple ApiImplicitParam objects.
| `@ApiModel` | Provides additional information about Swagger models. |
| `@ApiModelProperty` | Adds and manipulates data of a model property. |
| `@ApiOperation` | Describes an operation or typically a HTTP method against a specific path. |
| `@ApiParam` | Adds additional meta-data for operation parameters. |
| `@ApiResponse` | Describes a possible response of an operation. |
| `@ApiResponses` | A wrapper to allow a list of multiple ApiResponse objects. |
| `@Authorization` | Declares an authorization scheme to be used on a resource or an operation. |
| `@AuthorizationScope` | Describes an OAuth2 authorization scope. |

더 자세한 설명은 [Swagger Annotation Wiki](https://github.com/swagger-api/swagger-core/wiki/annotations)를 참고.

# Custom Annotation

Swagger에서 제공하는 Annotation 뿐만 아니라 직접 생성한 Custom Annotation에 대해서도 api document에 설명을 추가하도록 할 수 있습니다.

Model과 Model Property에 대한 정보가 api document로 작성될 때, 각각의 플러그인 클래스의 `apply()` 메서드를 통해 API Document가 작성됩니다. 그리고 이 과정을 거칠 때 설정되어 있는 Swagger annotation을 통해 추가적인 설명을 추가합니다.

때문에 커스텀 어노테이션을 클래스 혹은 클래스 필드에 적용했을 때, 그에 맞는 플러그인 클래스를 작성하고 빈으로 등록하여 Swagger에서 API document를 작성할 때 커스텀 어노테이션에 대한 적절한 설명을 추가하도록 설정할 수 있습니다.

## Model<sup>Class</sup>에 붙은 어노테이션

Model의 경우 Spring에 정의되어 있는 `AnnotationUtil` 클래스를 사용할 수 있습니다. `ModelBuilderPlugin`를 상속받는 빈을 생성하여 클래스에 설정된 커스텀 어노테이션에 대한 설명을 API Document에 추가할 수 있습니다.

Swagger에서 제공하는 `@ApiModel` 어노테이션의 경우, `ApiModelBuilder` 클래스 빈을 통해 유저가 작성한 추가적인 설명을 API Document에 작성하는 것을 확인할 수 있습니다.

```java
@Component
@Order(SwaggerPluginSupport.SWAGGER_PLUGIN_ORDER)
public class ApiModelBuilder implements ModelBuilderPlugin {
    ...
    @Override
    public void apply(ModelContext context) {
        ApiModel annotation = AnnotationUtils.findAnnotation(forClass(context), ApiModel.class);
        if (annotation != null) {
            context.getBuilder().description(annotation.description());
        }
    }
    ...
}
```

## Model Property<sup>Class Field</sup>에 붙은 어노테이션

Model Property의 경우, API document 생성을 위한 `ModelPropertyContext` 클래스에 클래스 필드의 설정된 어노테이션에 대한 정보를 함께 담고 있습니다. 이를 통해 플러그인의 `apply()` 메서드에서 클래스 필드의 어노테이션에 접근하여 API Document에 설명을 추가할 수 있습니다.

Swagger에서 제공하는 `@ApiModelProperty` 어노테이션의 경우, `ApiModelPropertyPropertyBuilder` 클래스 빈을 사용하여 API Document에 추가적인 설명을 추가합니다.

```java
@Component
@Order(SwaggerPluginSupport.SWAGGER_PLUGIN_ORDER)
public class ApiModelPropertyPropertyBuilder implements ModelPropertyBuilderPlugin {
    @Override
    public void apply(ModelPropertyContext context) {
        Optional<ApiModelProperty> annotation = Optional.absent();

        if (context.getAnnotatedElement().isPresent()) {
            annotation = annotation.or(findApiModePropertyAnnotation(context.getAnnotatedElement().get()));
        }
        if (context.getBeanPropertyDefinition().isPresent()) {
            annotation = annotation.or(findPropertyAnnotation(
                context.getBeanPropertyDefinition().get(), ApiModelProperty.class));
        }
        if (annotation.isPresent()) {
            context.getBuilder()
                .allowableValues(annotation.transform(toAllowableValues()).orNull())
                .required(annotation.transform(toIsRequired()).or(false))
                .readOnly(annotation.transform(toIsReadOnly()).or(false))
                .description(annotation.transform(toDescription()).orNull())
                .isHidden(annotation.transform(toHidden()).or(false))
                .type(annotation.transform(toType(context.getResolver())).orNull())
                .position(annotation.transform(toPosition()).or(0))
                .example(annotation.transform(toExample()).orNull());
        }
    }
    ...
}
```


# References  
swagger : https://swagger.io/  
swagger2markup : http://swagger2markup.github.io/swagger2markup/1.3.3/#_swagger2markup_api  
swgager2markup cli : https://github.com/Swagger2Markup/swagger2markup-cli