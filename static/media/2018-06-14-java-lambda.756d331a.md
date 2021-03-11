![java-lambda-01](https://user-images.githubusercontent.com/18159012/41402138-7e7a2af4-6ffc-11e8-88e4-6bf056870d35.jpg)

 람다 대수는 1936년 아로존 처치<sub>앨런 튜링의 스승</sub>에 의해 고안되었으며, 함수형 언어의 계산 모델이다. 현재 사용되고 있는 람다의 근간은 수학과 기초 컴퓨터과학 분야에서의 **람다 대수**이다. 람다 대수는 간단히 말하자면 수학에서 사용하는 함수를 보다 단순하게 표현하는 방법으로 다음과 같은 특징이 있다.

1. 람다 대수는 이름을 가질 필요가 없다. (익명 함수<sup>Anonymous Function</sup>)
2. 두 개 이상의 입력이 있는 함수는 최종적으로 1개의 입력만 받는 람다 대수로 단순화 될 수 있다. (커링<sup>Curring</sup>)

 자바 8은 모던 자바라 불리며, 함수형 프로그래밍의 콘셉을 가져오면서 람다가 Java 8부터 지원되었다. 추상 메서드가 하나만 존재하는 인터페이스인 함수형 인터페이스를 사용해 익명 함수로 표현되는 람다를 정의하여 사용한다.

```java
public class Main {

    public static void main(String[] args) {
        Functional functional = () -> System.out.println("Hello lambda");
        functional.doSomething();
    }

    interface Functional {
        void doSomething();
    }
}

```

 하지만 자바의 람다는 함수형 언어의 표현을 위한 내부적인 새로운 개념이 아니다. JVM의 바이트 코드 레벨에서 새로운 함수 타입을 구현할 명세가 없기 때문이다. 그렇다고 단순히 함수형 인터페이스의 표현만 바꾼 것도 아니다.

# 익명 함수

 각 언어별로 익명 함수를 표현하는 법은 제각기 다르지만, 공통적으로 가지는 특징이 있다. 바로 일급 객체<sup>First-class Citizen</sup> 라는 점이다.

 일급 객체의 조건은 다음과 같다.

- 변수(variable)에 담을 수 있다.
- 인자(parameter)로 전달할 수 있다.
- 반환값(return value)으로 전달할 수 있다.

 프로그래밍 언어에서 익명 함수는 애초에 다른 함수에 인자로 넘기거나 함수의 결과 값으로 리턴할 용도로 만들어지기 때문에 일급 객체의 특징을 갖게 된다.

 자바에선 위의 조건을 대조해봤을 때 일급 객체는 자바의 객체가 된다.  객체지향이라는 이름에 합당한 일급 객체가 되는 것이다. 하지만 함수형 프로그래밍 패러다임이 함수 자체가 일급 객체의 조건을 성립하면서 자바에선 객체를 통해 이를 표현해야 했다. 때문에 객체인 함수형 인터페이스를 통해 람다를 사용하는 것이다.

# 람다의 작동

 위에서 함수형 인터페이스와 람다 표현을 설명하기 위해 작성한 Main 클래스의 인터페이스 버전과 람다 버전을 javap -c -p 명령어를 통해 각각 decompile하면 다음과 같다.

```java
// Interface version
Compiled from "Main.java"
public class Main {
  public Main();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: new           #2                  // class Main$1
       3: dup
       4: invokespecial #3                  // Method Main$1."<init>":()V
       7: astore_1
       8: aload_1
       9: invokeinterface #4,  1            // InterfaceMethod Main$Functional.doSomething:()V
      14: return
}
```

```java
// Lambda version
Compiled from "Main.java"
public class Main {
  public Main();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: invokedynamic #2,  0              // InvokeDynamic #0:doSomething:()LMain$Functional;
       5: astore_1
       6: aload_1
       7: invokeinterface #3,  1            // InterfaceMethod Main$Functional.doSomething:()V
      12: return

  private static void lambda$main$0();
    Code:
       0: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #5                  // String Hello lambda
       5: invokevirtual #6                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}
```

 `Main` 클래스의 생성자가 불린 후, `main` 메서드가 실행될 때 차이점이 있다. 인터페이스로 구현한 코드에선 `invokespecial`이 호출되어 메모리 할당과 익명 클래스의 생성자가 호출되지만, 람다로 구현한 코드에선 `invokedynamic`이 호출될 뿐이다. 그리고 코드에선 정의하지 않은 private static 메서드가 생성되어있다.

 `invokedynamic`은 자바 7부터 추가된 명령<sup>Instruction</sup>으로, 동적 메서드 호출을 통해 JVM에서의 동적 언어<sup>Dynamic Language</sup> 사용을 용이하게 한다. `invokedynamic` 이전엔 바이트코드에서 동적 메서드 호출을 위한 엔트리 포인트를 만들고 아래 네개의 명령어를 통해 동적 메서드 호출을 수행했다.

> - `invokestatic`  : static 메서드를 호출할 때 사용.
> - `invokevirtual` : public과 protected 접근자를 갖는 non-static 메서드를 [dynamic dispatch](http://en.wikipedia.org/wiki/Dynamic_dispatch)을 통해 호출할 때 사용.
> - `invokeinterface` : `invokevirtual`과 비슷하지만 interface type을 통해 메서드를 호출할 때 사용.
> - `invokespecial` : 생성자를 호출하거나, private 멤버변수와 수퍼클래스의 메서드를 호출할 때 사용.

 이런 방식은 성능에 영향을 주게 된다. 생성된 바이트 코드는 종종 하나의 동적 메서드 호출을 위해 JVM의 메서드들을 호출해야 한다. 리플렉션을 통한 동적 메서드 호출도 가능하지만 역시 성능 이슈를 피해가진 못한다.

 이런 성능 저하를 해결하기 위해, `invokedynamic` 명령은 LambdaMetaFactory 클래스의 bootstrap method를 사용한다. bootstrap  method는 람다 표현을 함수형 인터페이스 객체로 변환하여 `invokedynamic` 명령이 호출할 call site를 만든다.

```java
public class Main {

    public static void main(String[] args) {
        Main main = new Main();
        main.main();
    }

    public void main() {
        Functional functional = (obj) -> {
            System.out.println("main this : " + obj);
            System.out.println("lambda this : " + this);
        };
        functional.doSomething(this);
    }

    interface Functional {
        void doSomething(Object object);
    }
}

```

```console
lambda this : Main$1@1540e19d
main this : Main@677327b6
```

 위의 로그를 보면 Main$1이라는 자동생성된 함수 인터페이스를 확인할 수 있다. `-Djdk.internal.lambda.dumpProxyClasses` VM 옵션과 함께 코드를 실행하면 람다식으로 자동으로 정의된 동적 클래스를 파일로 저장하여 직접 확인할 수도 있다.

```java
import Main.Functional;
import java.lang.invoke.LambdaForm.Hidden;

// $FF: synthetic class
final class Main$$Lambda$1 implements Functional {
    private final Main arg$1;

    private Main$$Lambda$1(Main var1) {
        this.arg$1 = var1;
    }

    private static Functional get$Lambda(Main var0) {
        return new Main$$Lambda$1(var0);
    }

    @Hidden
    public void doSomething(Object var1) {
        this.arg$1.lambda$main$0(var1);
    }
}
```

 동적 클래스 내부에는 앞서 정의한 람다의 바디가 없다. 람다의 바디는 이를 호출하는 클래스에 private static 메서드로 자동 생성되고, 동적 클래스에서 파라메터를 받아 이 메서드를 호출하며 자바에서 람다가 작동하게 된다.

# 람다와 클로저<sup>Closure</sup>

 자바를 주로 사용하였다면 클로저라는 개념을 잘 모를 수 있다. 하지만 클로저가 람다로부터 파생된 개념이기 때문에 람다를 사용한다면 이 클로저를 알아두면 좋다.

 람다는 순수 함수말고도 외부 변수를 참조하도록 할 수 있다. 앞서 레퍼런스를 확인하는 코드를 외부변수를 참조하도록 수정하면 다음과 같다.

```java
public class Main {

    public static void main(String[] args) {
        Main main = new Main();
        main.main();
    }

    public void main() {
        Object externObj = this;
        Functional functional = (paramObj) -> {
            System.out.println("external this : " + externObj);
            System.out.println("param this : " + paramObj);
            System.out.println("lambda this : " + this);
        };
        functional.doSomething(this);
    }

    interface Functional {
        void doSomething(Object paramObj);
    }
}
```

```java
import Main.Functional;
import java.lang.invoke.LambdaForm.Hidden;

// $FF: synthetic class
final class Main$$Lambda$1 implements Functional {
    private final Main arg$1;
    private final Object arg$2;

    private Main$$Lambda$1(Main var1, Object var2) {
        this.arg$1 = var1;
        this.arg$2 = var2;
    }

    private static Functional get$Lambda(Main var0, Object var1) {
        return new Main$$Lambda$1(var0, var1);
    }

    @Hidden
    public void doSomething(Object var1) {
        this.arg$1.lambda$main$0(this.arg$2, var1);
    }
}
```

 자동 정의된 동적 클래스를 확인하면 외부 변수를 final 멤버 변수로 갖는 것을 알 수 있다. 그리고 람다가 사용될 때, 매개변수와 외부변수를 람다 바디에 전달한다. 하지만 람다 바디 입장에서 파라메터는 해당 스코프에 갇혀있지만, 외부변수는 어디서 와서 사용되는지 알 수가 없다. 이때의 외부변수는 *자유변수<sup>Free Variable</sup>*, 매개변수를 *묶인 변수<sup>Bound Variable</sup>*라고 부른다.

 위의 람다식에서는 자유 변수와 묶인 변수를 하나씩 사용하고 있다. 람다식은 사용하는 변수의 종류에 따라 두 종류로 나눌 수 있다. 바로 *닫힌 람다식<sup>Closed expression</sup>*과 *열린 람다식<sup>Open expression</sup>*이다.

람다 표현식에서 사용하는 변수들이 모두 묶인 변수일 때 *닫힌 람다식*이라고 부른다. 그리고 람다 표현식에서 사용하는 변수들 중 하나라도 자유 변수가 있을 때 *열린 람다식*이라고 부른다.

 위의 설명을 이해했다면 클로저를 아주 간단하게 설명할 수 있다. 클로저는 바로 열린 람다식을 닫힌 람다식으로 만드는 것이다. 클로저의 이름이 어떻게 유래되었는지도 예상이 될 것이다. 클로저는 람다식 내의 모든 자유 변수를 스코프 내로 가져와 묶는다. 그렇기 때문에 함수를 1급 객체로 사용하는 함수형 언어의 클로저는 만들어진 환경을 기억하는 것처럼 보이게 된다.
