Lombok은 간단한 어노테이션 세팅으로 자바에서 반복적으로 사용되는 메서드 혹은 구조들은 간편하게 사용할 수 있게 해주는 플러그인이다. getter/setter 등과 같은 메서들이 어노테이션으로 추가한 것 처럼 사용할 수 있는데 어떻게 이게 가능한 것일까?

Lombok은 컴파일 단계에서 관여하여 동작하게 된다. Java 6 에서 [JSR 269 Pluggable Annotation Processing API](https://www.jcp.org/en/jsr/detail?id=269) 추가되었는데, Lombok의 jar 파일을 확인하면 '/META-INF/services/javax.annotation.processing.Processor' 라는 이름의 파일을 확인 할 수 있다. 이는 `javac` 가 이 파일을 compilation classpath 에서 확인한다면 컴파일 단계에서 annotation processor를 동작 시킨다.

때문에 IntelliJ 에선 Lombok을 사용하기 위해 플러그인을 설치하는 것에 더해 annotation processor 옵션을 키도록 안내한다.

그렇다면 컴파일 단계에서 어떻게 Lombok에 의해 소스코드가 변경이 되는 것일까?

# 자바의 컴파일

자바에는 기본적으론 '파싱<sup>parse and enter</sup>', '주석 처리<sup>Annotation Processing</sup>' 그리고 '분석 및 생성<sup>Analyze and Generate</sup>'의 세 컴파일 단계가 존재한다.

첫번째 단계에선 컴파일러가 소스 파일을을 가지고 AST<sup>Abstract Source Tree</sup>를 생성한다. 이 단계에서 오직 syntax error만 체크된다.

두번때 단계는 pre-compliation 단계라고도 불린다. 해당 단계에선 클래스들이 검증되고 새 리소스가 생성된다. 전체 컴파일 프로세스를 실패시킬 수 있는 에러가 발생될 수 있다. 새 소스파일이 생성되면 컴파일이 첫번째 단계로 돌아가 프로세스를 반복한다.

마지막 단계인 '분석 및 생성'에선, 컴파일러가 AST를 기반으로 클래스를 생성한다. AST는 references, flow 그리고 다양한 측면에서 검증을 거친다. 모든 검증이 거쳐진 후 클래스 파일(*.class)이 작성된다.

# Lombok 에서의 컴파일

Project Lombok은 '주석 처리<sup>Annotation Processing</sup>' 단계에 스스로를 annotation processor로 둔다. 하지만 일반적인 annotation processor와는 다른데, 일반적인 작업은 새 파일을 생성하는 것이지만 Lombok의 경우 파일을 수정하는 것이다. 이는 AST를 변경하므로써 동작하는데 다음 단계에서 이를 사용하게 된다. 따라서 최종적으로 생성되는 클래스 파일에 Lombok의 작업이 반영되게 된다. Lombok 이 방법을 통해서 새로운 메서드를 추가하는 것 뿐만 아니라 작성된 메서드에 새로운 코드를 주입 할 수 있다.

# Lombok이 제공하는 기능들

Lombok을 통해서 제공되는 annotation은 다양하지만 중요한 역할을 하는 기능들은 다음과 같다.

Mutable Entities : 보일러 플레이트 코드들이 여기에 포함된다. 예를 들어 생성자, setter / getter, `toString()`, `hascode()` 등이 여기에 포함된다.

Immutable Classes : 필드의 선언을 제외하고 하나의 annotation으로 모든 항목을 수정할 수 있다. (`@Value`, `@Data` 등)

이외에도 `final` 로컬 변수를 대체하거나 로깅을 위한 annotation들을 제공한다. Lombok을 통해서 반복적이고 많은 코딩을 피하고 더 깨끗한 코드를 작성할 수 있다.
  
> ### Reference
> Lombok : https://projectlombok.org/  
> Creating Custom Transformations: http://notatube.blogspot.com/2010/12/project-lombok-creating-custom.html